import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductsEntity } from './entities/order-products.entity';
import { ShippingEntity } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductsEntity)
    private readonly opRepository: Repository<OrderProductsEntity>,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;
    const order = await this.orderRepository.save(orderEntity);
    let opEntity: {
      orderId: number;
      productId: number;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const orderId = order.id;
      const productId = createOrderDto.orderedProducts[i].id;
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
    }
    const op = await this.opRepository.createQueryBuilder()
    .insert()
    .into(OrderProductsEntity)
    .values(opEntity)
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
