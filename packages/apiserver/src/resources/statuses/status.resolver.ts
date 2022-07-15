import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Status } from './status.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { CreateStatusInput } from '@mimir/global-types';
import { AuthGuard } from '../../auth/auth.guard';
import { Material } from '../materials/material.entity';

@Resolver('Status')
export class StatusResolver {
  @Query(() => [Status])
  @UseGuards(AuthGuard)
  async getStatusesByPerson(@Args('person_id') id: string) {
    return Status.find({ where: { person_id: id } });
  }

  @Query(() => [Status])
  @UseGuards(AuthGuard)
  async getStatusesByMaterial(@Args('material_id') id: string) {
    return Status.find({ where: { material_id: id } });
  }

  @Mutation(() => Status)
  @UseGuards(AuthGuard)
  async createStatus(@Args('input') createStatusInput: CreateStatusInput) {
    try {
      const status = await Status.create(createStatusInput);
      await Status.save(status);
      return status;
    } catch (e) {
      throw new BadRequestException();
    }
  }
  @ResolveField(() => Material)
  async material(@Parent() statuses: Status) {
    const { material_id } = statuses;
    return Material.findOne({ where: { id: material_id } });
  }
}
