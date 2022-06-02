import { Injectable } from '@nestjs/common';
import { Material } from '../materials/material.entity';
import { ClaimBookInput, ProlongTimeInput } from '@mimir/global-types';
import { Status } from '../statuses/status.entity';
import { Connection } from 'typeorm';
import { ErrorBook } from '../../errors';
import { StatusTypes } from '../../utils/types/statusTypes';
import { setTimeToProlong } from '../../utils/helpersFunctions/setTimeToProlong';
import { config } from '../../config';

@Injectable()
export class ItemService {
  constructor(private connection: Connection) {}

  async claim(claimBookInput: ClaimBookInput) {
    const queryRunner = this.connection.createQueryRunner();
    const statusRepository =
      queryRunner.manager.getRepository<Status>('status');
    const materialRepository =
      queryRunner.manager.getRepository<Material>('material');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { identifier, person_id } = claimBookInput;
      const material = await materialRepository.findOne({
        where: { identifier },
      });

      if (!material) {
        throw new ErrorBook('This item is not registered in the library');
      }
      const { id } = material;
      const status = await statusRepository.find({
        where: { material_id: id },
        order: { created_at: 'DESC' },
        take: 1,
      });
      if (status[0].status === StatusTypes.BUSY) {
        throw new ErrorBook(`This book is busy. Ask the manager!`);
      }
      const newStatusObj = await statusRepository.create({
        status: StatusTypes.BUSY,
        material_id: status[0].material_id,
        person_id,
      });
      const newStatus = await statusRepository.save(newStatusObj);
      await queryRunner.commitTransaction();
      return newStatus;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return {
        message: e.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTakenItems(person_id: number) {
    try {
      const materials = await Status.createQueryBuilder('status')
        .leftJoinAndSelect('status.material', 'material')
        .leftJoinAndSelect('status.person', 'person')
        .distinctOn(['material_id'])
        .orderBy('material_id', 'DESC')
        .where('person_id = :person_id', { person_id })
        .andWhere('status IN(:...status)', {
          status: [StatusTypes.BUSY, StatusTypes.PROLONG],
        })
        .addOrderBy('status.created_at', 'DESC')
        .getMany();
      return materials;
    } catch (e) {
      return {
        message: e.message,
      };
    }
  }

  async prolong(prolongTime: ProlongTimeInput) {
    try {
      const { person_id, material_id } = prolongTime;
      const [currentStatus] = await Status.find({
        where: { material_id, person_id },
        order: { created_at: 'DESC' },
        take: 1,
      });
      if (currentStatus.status === StatusTypes.PROLONG) {
        throw new ErrorBook('This item has already been extended!');
      }
      if (currentStatus.status === StatusTypes.FREE) {
        throw new ErrorBook('This book is free!');
      }
      const prolongStatus = await Status.create({
        status: StatusTypes.PROLONG,
        created_at: setTimeToProlong(
          currentStatus.created_at,
          config.shelfLife
        ),
        material_id: currentStatus.material_id,
        person_id: currentStatus.person_id,
      });
      return Status.save(prolongStatus);
    } catch (e) {
      return {
        message: e.message,
      };
    }
  }
}
