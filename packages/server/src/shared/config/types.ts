const types = {
  controllers: {
    HelloController: Symbol('HelloController'),
    UserController: Symbol('UserController'),
  },
  repositories: {},
  services: {
    HelloService: Symbol('HelloService'),
    CognitoService: Symbol('CognitoService'),
  },
  utils: {},
  caches: {},
};

export default types;
