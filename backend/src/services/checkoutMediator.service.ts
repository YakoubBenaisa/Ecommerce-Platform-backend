import { injectable, inject } from "tsyringe";
import IProductService from "./Interfaces/IProductService";
import IOrderService from "./Interfaces/IOrderService";
import IChargiliAccountService from "./Interfaces/IChargiliAccountService";
import IPaymentService from "./Interfaces/IPaymentService";
import ICustomerService from "./Interfaces/ICustomerService";
import { BadRequestError, ConflictError } from "../types/errors";
import {
  TCustomerCreate,
  TOrderCreate,
  TOrderItems,
  TPaymentCreate,
  TPlaceOrderData,
} from "../types/types";
import IProductRepository from "../repositories/interfaces/IProductRepository";
import { Prisma } from "@prisma/client";

@injectable()
export default class CheckoutMediatorService {
  private productPriceMap = new Map<string, number>();

  constructor(
    @inject("IProductService")
    private productService: IProductService,
    @inject("IOrderService")
    private orderService: IOrderService,
    @inject("IChargiliAccountService")
    private chargiliAccountService: IChargiliAccountService,
    @inject("IPaymentService")
    private paymentService: IPaymentService,
    @inject("ICustomerService")
    private customerService: ICustomerService,
    @inject("IProductRepository")
    private productRepository: IProductRepository
  ) {}

  async processCheckout(receivedData: TPlaceOrderData) {
    try {
      // Step 1: Separate order, items, and customer data from received data
      const { customer: customerInfo, order: orderInfo, items } = receivedData;

      // Step 2: Create Customer
      const customerData: TCustomerCreate = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        store_id: orderInfo.store_id,
      };

      const createdCustomer = await this.customerService.createCustomer(
        customerData
      );

      // Step 3: Check Inventory
      const products = await this.productService.CheckInventory(items);

      // Populate the productPriceMap with product prices
      products.forEach((product) => {
        this.productPriceMap.set(product.id, product.price.toNumber());
      });

      // Step 5: Calculate Total Amount
      const totalAmount = this.calculateTotalAmount(items);

      // Step 6: Prepare Order Data to Create
      const orderCreateData: TOrderCreate = {
        store_id: orderInfo.store_id,
        customer_id: createdCustomer.id,
        total_amount: totalAmount,
        status: "pending",
        payment_method: orderInfo.payment_method || "cash_on_delivery",
        order_source: orderInfo.order_source || "platform",
        address: orderInfo.address || Prisma.JsonNull,
      };

      // Map order items to include product_id, quantity, and unit_price
      const orderItems: TOrderItems = items.map((item: any) => {
        // Attempt to retrieve the unit price from the map
        let unitPrice = this.productPriceMap.get(item.id);

        // Fallback: If not found in the map, find the product in the products array
        if (unitPrice === undefined) {
          const product = products.find((p) => p.id === item.id);
          if (product) {
            unitPrice = product.price.toNumber();
          } else {
            throw new Error(`Product with id ${item.id} not found.`);
          }
        }
        return {
          product_id: item.id,
          quantity: item.quantity,
          unit_price: unitPrice,
        };
      });

      // Step 7: Create Order and Order Items
      const order = await this.orderService.createOrder(
        orderCreateData,
        orderItems
      );

      // If the payment method is "cash_on_delivery", no payment processing is needed.
      if (order.payment_method === "cash_on_delivery") {
        return {
          customer: createdCustomer,
          order,
        };
      }

      // Step 8: Get Secret Key (for non-cash payment methods)
      const secret_key: string | null =
        await this.chargiliAccountService.getSecretKeyByStoreID(
          orderInfo.store_id
        );
      if (!secret_key) {
        throw new BadRequestError("Chargili account not found for the store");
      }

      // Step 9: Process Payment
      const paymentData: TPaymentCreate = {
        order_id: order.id,
        amount: order.total_amount,
        payment_method: order.payment_method,
        status: "pending",
      };
      const payment_link: string = await this.paymentService.createPayment(
        paymentData,
        secret_key
      );

      return {
        customer: createdCustomer,
        order,
        payment_Link: payment_link,
      };
    } catch (error) {
      throw error;
    }
  }

  private calculateTotalAmount(items: any[]): number {
    let totalAmount = 0;

    for (const item of items) {
      const price = this.productPriceMap.get(item.id);
      if (price === undefined)
        throw new ConflictError(`Price for product id ${item.id} not found.`);
      // Using item.quantity to calculate the total amount
      totalAmount += price * item.quantity;
    }

    return totalAmount;
  }
}
