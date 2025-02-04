
import { injectable , inject} from 'tsyringe';
import { PrismaClient, ChargiliAccount } from '@prisma/client';
import  IChargiliAccountRepository  from './interfaces/IChargiliAccountRepository';
import db from '../config/db';
import { TChargiliAccountCreate } from '../types/types';

@injectable()
export default class ChargiliAccountRepository implements IChargiliAccountRepository {
    private prisma: PrismaClient;

    constructor(@inject("db") private prismaService: db) {
      this.prisma = prismaService.getClient();
    }

  async create(data: TChargiliAccountCreate) {
    
    return this.prisma.chargiliAccount.create({
       data 
      });
  }

  async deleteByStoreId(storeId: string) {
   
    return this.prisma.chargiliAccount.delete({ where: { store_id: storeId } });
  }

  async updateByStoreId(data:TChargiliAccountCreate) {
    console.log(data);
   
    return this.prisma.chargiliAccount.update({
      where: { store_id: data.store_id },
      data: {
        SECRET_KEY: data.SECRET_KEY
      }
    });
  }
}