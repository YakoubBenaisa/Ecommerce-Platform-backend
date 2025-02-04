
import { injectable ,inject } from 'tsyringe';
import { Prisma} from '@prisma/client';
import  IChargiliAccountService  from './Interfaces/IChargiliAccountService';
import  IStoreService  from './Interfaces/IStoreService';
import  IChargiliAccountRepository  from '../repositories/interfaces/IChargiliAccountRepository';
import { TChargiliAccountCreate } from '../types/types';
import { NotFoundError, ConflictError,InternalServerError } from '../types/errors';
import { handlePrismaError } from '../utils/handlePrismaErrors';

@injectable()
export default class ChargiliAccountService implements IChargiliAccountService {
  constructor(
    @inject('IStoreService') private storeService: IStoreService,
    @inject('IChargiliAccountRepository') private chargiliAccountRepo: IChargiliAccountRepository,
   
  ) {}

  async setupPayment(data:TChargiliAccountCreate ) {
    try {

      const account = await this.chargiliAccountRepo.create(data);
      await this.storeService.updateStore({id: data.store_id, payment_setup_status: true});
      return account;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) 
          handlePrismaError(error, { resource: 'ChargiliAccount' });
        
        throw new InternalServerError("Failed to create ChargiliAccount");
      }
  }

  async deletePaymentSetup(storeId: string){
    try{
const account = await this.chargiliAccountRepo.deleteByStoreId(storeId);
await this.storeService.updateStore({id: storeId, payment_setup_status: false});
return account;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) 
          handlePrismaError(error, { resource: 'ChargiliAccount' });
        
        throw new InternalServerError("Failed to Delete ChargiliAccount");
      }
   
  }

  async updatePaymentSetup(data : TChargiliAccountCreate) {
    try {
      return this.chargiliAccountRepo.updateByStoreId(data);
     
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
        handlePrismaError(error, { resource: 'ChargiliAccount' });
      
      throw new InternalServerError("Failed to update ChargiliAccount");
    }
  }
}