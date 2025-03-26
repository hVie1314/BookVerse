
class TestController {
   // [GET] /test/hello-world
   helloWorld(req, res, next) {
      console.log('TestController:helloWorld');
      return res.json({ message: 'Hello World' });
   }
}

module.exports = new TestController();