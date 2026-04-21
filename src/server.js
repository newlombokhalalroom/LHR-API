require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Jwt = require('@hapi/jwt');
const AuthStrategyConfig = require('./utils/authStrategy');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validators/users');
const ClientError = require('./exceptions/ClientError');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/redis/AuthenticationsService');
const AuthenticationsValidator = require('./validators/authentications');
const TokenManager = require('./tokenize/TokenManager');

// docs
const docs = require('./api/docs');

// contacts
const contacts = require('./api/contacts');
const ContactsService = require('./services/postgres/ContactsService');
const ContactsValidator = require('./validators/contacts');

// email-verification
const verification = require('./api/verifications');
const SendEmailService = require('./services/nodemailer/SendEmailService');

// cache
const CacheService = require('./services/redis/CacheService');

// roles
const roles = require('./api/roles');
const UserRolesService = require('./services/postgres/UserRolesService');
const UserRolesValidator = require('./validators/userRoles');

// client types
const clientTypes = require('./api/clientTypes');
const ClientTypesService = require('./services/postgres/ClientTypesService');
const ClientTypesValidator = require('./validators/clientTypes');

// clients
const clients = require('./api/clients');
const ClientsService = require('./services/postgres/ClientsService');
const ClientsValidator = require('./validators/clients');
const ClientPicturesService = require('./services/postgres/ClientPicturesService');

// facilities
const facilities = require('./api/facilities');
const FacilitiesService = require('./services/postgres/FacilitiesService');
const FacilitiesValidator = require('./validators/facilities');

// policies
const policies = require('./api/policies');
const PoliciesService = require('./services/postgres/PoliciesSerive');
const PoliciesValidator = require('./validators/policies');

// clients_facilites
const clientsFacilities = require('./api/clientsFacilities');
const ClientsFacilitiesService = require('./services/postgres/ClientsFacilitiesService');
const ClientsFacilitiesValidator = require('./validators/clientsFacilities');

// locations
const LocationsService = require('./services/postgres/LocationsService');

//advertisements
const advertisements = require('./api/advertisements');
const AdvertisementsService = require('./services/postgres/AdvertisementsService');
const AdvertisementsValidator = require('./validators/advertisements');

// products
const products = require('./api/products');
const ProductsService = require('./services/postgres/ProductsService');
const ProductsAmenitiesService = require('./services/postgres/ProductsAmenitiesService');
const ProductPicturesService = require('./services/postgres/ProductPicturesService');
const ProductsDetailsService = require('./services/postgres/ProductsDetailsService');
const ProductsOptionsService = require('./services/postgres/ProductsOptionsService');
const ProductsValidator = require('./validators/products');

// amenities
const amenities = require('./api/amenities');
const AmenitiesService = require('./services/postgres/AmenitiesService');
const AmenitiesValidator = require('./validators/amenities');

// details
const details = require('./api/details');
const DetailsService = require('./services/postgres/DetailsService');

// details_categories
const DetailCategoriesService = require('./services/postgres/DetailCategoriesService');
const DetailsValidator = require('./validators/details');

// product items
const ProductItemsService = require('./services/postgres/ProductItemsService');

// Unavailable Status
const UnavailableStatusService = require('./services/postgres/UnavailableStatusService');

// orders
const orders = require('./api/orders');
const OrdersService = require('./services/postgres/OrdersService');
const OrdersValidator = require('./validators/orders');

// order items
const OrderItemsService = require('./services/postgres/OrderItemsService');

// Balances Service
const BalancesService = require('./services/postgres/BalancesService');

// user details
const UserDetailsService = require('./services/postgres/UserDetailsService');

// client details
const ClientDetailsService = require('./services/postgres/ClientDetailsService');

// clients policies service
const ClientsPoliciesService = require('./services/postgres/ClientsPoliciesService');

// orderProductDetailsService
const OrderProductDetailsService = require('./services/postgres/OrderProductDetailsService');

const EmailTemplates = require('./templates/emailTemplates');

// Options
const options = require('./api/options');
const OptionsValidator = require('./validators/options');
const OptionsService = require('./services/postgres/OptionsService');

// Banks
const banks = require('./api/banks');
const BanksValidator = require('./validators/banks');
const BanksService = require('./services/postgres/BanksService');

// Cards
const cards = require('./api/cards');
const CardsService = require('./services/postgres/CardsService');
const CardsValidator = require('./validators/cards');

// Withdrawals
const withdrawals = require('./api/withdrawals');
const WithdrawalsServices = require('./services/postgres/WithdrawalsService');
const WithdrawalsValidator = require('./validators/withdrawals');

// Destinations
const destinations = require('./api/destinations');
const DestinationsValidator = require('./validators/destinations');
const DestinationsService = require('./services/postgres/DestinationsService');
const DestinationPicturesService = require('./services/postgres/DestinationPicturesService');

// Order Options Items Service
const OrderOptionsItemsService = require('./services/postgres/OrderOptionsItemsService');

// ProductsPoliciesService
const ProductsPoliciesService = require('./services/postgres/ProductPoliciesService');

// Reviews Service
const ReviewsService = require('./services/postgres/ReviewsService');

// Health
const health = require('./api/health');

const init = async () => {
  const cacheService = new CacheService();
  const userRolesService = new UserRolesService();
  const usersService = new UsersService(cacheService, userRolesService);
  const authenticationsService = new AuthenticationsService(cacheService);
  const contactsService = new ContactsService(cacheService);
  const clientTypesService = new ClientTypesService();
  const clientsService = new ClientsService();
  const clientPicturesService = new ClientPicturesService();
  const facilitiesService = new FacilitiesService();
  const clientsFacilitiesService = new ClientsFacilitiesService();
  const locationsService = new LocationsService();
  const amenitiesService = new AmenitiesService();
  const detailCategoriesService = new DetailCategoriesService();
  const detailsService = new DetailsService();
  const productsService = new ProductsService();
  const productsAmenitiesService = new ProductsAmenitiesService();
  const productPicturesService = new ProductPicturesService();
  const productsDetailsService = new ProductsDetailsService();
  const productItemsService = new ProductItemsService();
  const unavailableStatusService = new UnavailableStatusService();
  const orderOptionsItemsService = new OrderOptionsItemsService();
  const ordersService = new OrdersService();
  const orderItemsService = new OrderItemsService(productsService);
  const balancesService = new BalancesService();
  const userDetailsService = new UserDetailsService();
  const clientDetailsService = new ClientDetailsService();
  const policiesService = new PoliciesService();
  const clientsPoliciesService = new ClientsPoliciesService();
  const orderProductDetailsService = new OrderProductDetailsService();
  const emailTemplates = new EmailTemplates(
    ordersService,
    userDetailsService,
    clientDetailsService,
    orderItemsService,
  );
  const sendEmailService = new SendEmailService(cacheService, contactsService, emailTemplates);
  const optionsService = new OptionsService();
  const productsOptionsService = new ProductsOptionsService();
  const banksService = new BanksService();
  const cardsService = new CardsService();
  const withdrawalsService = new WithdrawalsServices();
  const destinationsService = new DestinationsService();
  const destinationPicturesService = new DestinationPicturesService();
  const productsPoliciesService = new ProductsPoliciesService();
  const reviewsService = new ReviewsService();
  const advertisementsService = new AdvertisementsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('lombokhalalroom_jwt', 'jwt', AuthStrategyConfig);

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
        contactsService,
        sendEmailService,
        balancesService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        authenticationsValidator: AuthenticationsValidator,
      },
    },
    {
      plugin: docs,
    },
    {
      plugin: health,
    },
    {
      plugin: contacts,
      options: {
        service: contactsService,
        validator: ContactsValidator,
      },
    },
    {
      plugin: verification,
      options: {
        sendEmailService,
        contactsService,
      },
    },
    {
      plugin: roles,
      options: {
        userRolesService,
        UserRolesValidator,
      },
    },
    {
      plugin: clientTypes,
      options: {
        clientTypesService,
        ClientTypesValidator,
      },
    },
    {
      plugin: clients,
      options: {
        clientsService,
        clientTypesService,
        ClientsValidator,
        clientPicturesService,
        clientsFacilitiesService,
        locationsService,
        policiesService,
        clientsPoliciesService,
        productsService,
        productPicturesService,
        productItemsService,
        ProductsValidator,
      },
    },
    {
      plugin: facilities,
      options: {
        facilitiesService,
        clientTypesService,
        FacilitiesValidator,
      },
    },
    {
      plugin: clientsFacilities,
      options: {
        clientsFacilitiesService,
        clientsService,
        facilitiesService,
        ClientsFacilitiesValidator,
      },
    },
    {
      plugin: amenities,
      options: {
        amenitiesService,
        AmenitiesValidator,
        clientTypesService,
      },
    },
    {
      plugin: details,
      options: {
        detailsService,
        detailCategoriesService,
        typesService: clientTypesService,
        DetailsValidator,
      },
    },
    {
      plugin: products,
      options: {
        productsService,
        amenitiesService,
        clientsService,
        productPicturesService,
        detailsService,
        productsDetailsService,
        productsAmenitiesService,
        ProductsValidator,
        productItemsService,
        unavailableStatusService,
        optionsService,
        productsOptionsService,
        productsPoliciesService,
        policiesService,
        reviewsService,
      },
    },
    {
      plugin: orders,
      options: {
        ordersService,
        orderItemsService,
        contactsService,
        productsService,
        userDetailsService,
        clientDetailsService,
        orderProductDetailsService,
        balancesService,
        OrdersValidator,
        clientsService,
        cacheService,
        optionsService,
        orderOptionsItemsService,
        sendEmailService,
        reviewsService,
      },
    },
    {
      plugin: policies,
      options: {
        policiesService,
        clientTypesService,
        PoliciesValidator,
      },
    },
    {
      plugin: options,
      options: {
        OptionsValidator,
        clientTypesService,
        optionsService,
      },
    },
    {
      plugin: banks,
      options: {
        BanksValidator,
        banksService,
      },
    },
    {
      plugin: cards,
      options: {
        banksService,
        cardsService,
        CardsValidator,
      },
    },
    {
      plugin: withdrawals,
      options: {
        cardsService,
        balancesService,
        withdrawalsService,
        WithdrawalsValidator,
      },
    },
    {
      plugin: destinations,
      options: {
        DestinationsValidator,
        destinationsService,
        destinationPicturesService,
      },
    },
    {
      plugin: advertisements,
      options: {
        advertisementsService,
        AdvertisementsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: false,
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      // eslint-disable-next-line no-console
      console.log(response.message);
      const newResponse = h.response({
        status: false,
        message: 'An error occurred on the server.',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
