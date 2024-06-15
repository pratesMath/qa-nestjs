import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dto/create-customers.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';
import { CustomersEntity } from './entity/customers.entity';

const customersEntityList: CustomersEntity[] = [
  new CustomersEntity({
    customerId: '1',
    fullName: 'Matheus',
    cpf: '224.781.170-10',
    birthDate: '2003-07-30',
    email: 'test.qa@teddy.com',
    monthlyIncome: 160000,
    phoneNumber: '(11)92233-4455',
  }),
  new CustomersEntity({
    customerId: '2',
    fullName: 'Pedro',
    cpf: '932.175.300-12',
    birthDate: '2003-12-30',
    email: 'test2.qa@teddy.com',
    monthlyIncome: 160000,
    phoneNumber: '(11)93344-5566',
  }),
];

const newCustomerEntity = new CustomersEntity({
  fullName: 'Marcos',
  birthDate: '1996-11-23',
  cpf: '653.064.250-11',
  email: 'marcos.test.qa@teddy.com',
  monthlyIncome: 12000,
  phoneNumber: '(11) 91244-3356',
});

const updatedCustomerEntity = new CustomersEntity({
  fullName: 'Marcos',
  birthDate: '1996-11-23',
  cpf: '653.064.250-11',
  email: 'updated.marcos.test.qa@teddy.com',
  monthlyIncome: 12000,
  phoneNumber: '(11) 91244-9090',
});

describe('CustomersController', () => {
  let customersController: CustomersController;
  let customersService: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn().mockResolvedValue(newCustomerEntity),
            findAll: jest.fn().mockResolvedValue(customersEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(customersEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedCustomerEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    customersController = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(customersController).toBeDefined();
    expect(customersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a customer entity list successfully', async () => {
      // Act
      const result = await await customersController.allCustomers();
      // Assert
      expect(result).toEqual(customersEntityList);
      expect(typeof result).toEqual('object'); // Array é um objeto em JS
      expect(customersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // Arrange
      jest
        .spyOn(customersService, 'findAll')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersController.allCustomers()).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new customer successfully', async () => {
      // Arrange
      const body: CreateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-3356',
      };
      // Act
      const result = await customersController.create(body);
      // Assert
      expect(result).toEqual(newCustomerEntity);
      expect(customersService.create).toHaveBeenCalledTimes(1);
      expect(customersService.create).toHaveBeenCalledWith(body);
    });
    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(customersService, 'create').mockRejectedValueOnce(new Error());

      const body: CreateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-3356',
      };
      // Assert
      expect(customersController.create(body)).rejects.toThrow();
    });
  });

  describe('show', () => {
    it('should get a single customer successfully', async () => {
      // Act
      const result = await customersController.show('1');

      // Assert
      expect(result).toEqual(customersEntityList[0]);
      expect(customersService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(customersService.findOneOrFail).toHaveBeenCalledWith('1');
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customersService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersController.show('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      // Arrange
      const body: UpdateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'updated.marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-9090',
      };
      // Act
      const result = await customersController.update('1', body);
      // Assert
      expect(result).toEqual(updatedCustomerEntity);
      expect(customersService.update).toHaveBeenCalledTimes(1);
      expect(customersService.update).toHaveBeenCalledWith('1', body);
    });
    it('should throw an exception', () => {
      // Arrange
      const body: UpdateCustomerDTO = {
        fullName: 'Marcos',
        birthDate: '1996-11-23',
        cpf: '653.064.250-11',
        email: 'updated.marcos.test.qa@teddy.com',
        monthlyIncome: 12000,
        phoneNumber: '(11) 91244-9090',
      };

      jest.spyOn(customersService, 'update').mockRejectedValueOnce(new Error());
      // Assert
      expect(customersController.update('1', body)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should remove a customer successfully', async () => {
      // Act
      const result = await customersController.delete('1');
      // Assert
      expect(result).toBeUndefined();
    });
    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(customersService, 'deleteById')
        .mockRejectedValueOnce(new Error());
      // Assert
      expect(customersController.delete('1')).rejects.toThrow();
    });
  });
});
