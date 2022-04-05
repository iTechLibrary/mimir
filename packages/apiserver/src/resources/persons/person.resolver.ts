import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Person } from './person.entity';
import { Status } from '../statuses/status.entity';
import { CreatePersonInput } from '../../__generated/graphql_types';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@Resolver('Person')
export class PersonResolver {
  @Query(() => [Person])
  async getAllPersons() {
    return Person.find();
  }

  @Query(() => Person)
  async getOnePerson(@Args('id') id: number | string) {
    return Person.findOne(id);
  }

  @Mutation(() => Person)
  async createPerson(@Args('input') createPersonInput: CreatePersonInput) {
    try {
      const { smg_id } = createPersonInput;
      const personFind = await Person.findOne(smg_id);
      if (personFind) {
        return new UnauthorizedException('A person already exists');
      }
      return Person.creation(createPersonInput);
    } catch (e) {
      return new BadRequestException();
    }
  }

  @ResolveField(() => [Status])
  async statuses(@Parent() person: Person) {
    const { id } = person;
    return Status.find({ where: { person_id: id } });
  }
}
