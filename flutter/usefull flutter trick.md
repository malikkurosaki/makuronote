1. Did you know? Dart supports string multiplication.
Here is a simple program showing how to print a Christmas tree with string multiplication:

void main() {
  for (var i = 1; i <= 5; i++) {
    print('🎄' * i);
  }
}
// Output:
// 🎄
// 🎄🎄
// 🎄🎄🎄
// 🎄🎄🎄🎄
// 🎄🎄🎄🎄🎄
Cool isn't it? 😉

You can use this to check how a long string fits inside a Text widget:

Text('You have pushed the button this many times:' * 5)
2. Need to execute multiple Futures concurrently? Use Future.wait.
Consider this mock API class that tells us the latest numbers of COVID cases:

// Mock API class
class CovidAPI {
  Future<int> getCases() => Future.value(1000);
  Future<int> getRecovered() => Future.value(100);
  Future<int> getDeaths() => Future.value(10);
}
To execute all these futures concurrently, use Future.wait. This takes a list or futures and returns a future of lists:

final api = CovidAPI();
final values = await Future.wait([
    api.getCases(),
    api.getRecovered(),
    api.getDeaths(),
]);
print(values); // [1000, 100, 10]
This is ideal when the futures are independent, and they don't need to execute sequentially.

3. Implement a "call" method in your Dart classes to make them callable like a function.
Here's an example PasswordValidator class:

class PasswordValidator {
  bool call(String password) {
    return password.length > 10;
  }
}
Because the method is named call, we can declare a class instance and use it as if it was a method:

final validator = PasswordValidator();
// can use it like this:
validator('test');
validator('test1234');
// no need to use it like this:
validator.call('not-so-frozen-arctic');
4. Need to invoke a callback but only if it's not null? Use the "?.call()" syntax.
Suppose we have a custom widget class that should call an onDragCompleted callback when a certain event takes place:

class CustomDraggable extends StatelessWidget {
  const CustomDraggable({Key key, this.onDragCompleted}) : super(key: key);
  final VoidCallback? onDragCompleted;

  void _dragComplete() {
    // TODO: Implement me
  }
  @override
  Widget build(BuildContext context) {/*...*/}
}
To invoke the callback, we could write this code:

  void _dragComplete() {
    if (onDragCompleted != null) {
      onDragCompleted();
    }
  }
But there is a simpler way (note the use of ?.):

  Future<void> _dragComplete() async {
    onDragCompleted?.call();
  }
5. Using anonymous functions and functions as arguments
In Dart, functions are first-class citizens, and can be passed as arguments to other functions.

Here is some code that defines an anonymous function and assigns it to a sayHi variable:

void main() {
  final sayHi = (name) => 'Hi, $name';
  welcome(sayHi, 'Andrea');
}

void welcome(String Function(String) greet,
             String name) {
  print(greet(name));
  print('Welcome to this course');
}
Then sayHi is passed to a welcome function that takes a Function argument and uses it to greet the user.

String Function(String) is a function type that takes a String argument and returns a String. Because the anonymous function above has the same signature, it can be passed directly as an argument, or via the sayHi variable.

This coding style is common when using functional operators such as map, where, and reduce.

For example, here's a simple function to calculate the square of a number:

int square(int value) {
  // just a simple example
  // could be a complex function with a lot of code
  return value * value;
}
Given a list of values, we can map over them to get the squares:

const values = [1, 2, 3];

values.map(square).toList();
Here we pass square as an argument, because its signature is exactly what the map operator expects. This means that we don't need to expand it with an anonymous function:

values.map((value) => square(value)).toList();
6. You can use collection-if and spreads with lists, sets AND maps
Collection-if and spreads are very useful when you write your UI as code.

But did you know that you can use them with maps as well?

Consider this example:

const addRatings = true;
const restaurant = {
  'name' : 'Pizza Mario',
  'cuisine': 'Italian',
  if (addRatings) ...{
    'avgRating': 4.3,
    'numRatings': 5,
  }
};
Here we're declaring a restaurant map, and only adding the avgRating and numRatings key-value pairs if addRatings is true. And because we're adding more than one key-value pair, we need to use the spread operator (...).

7. Need to iterate through a map in a null-safe manner? Use `.entries`:
Suppose you have this map:

const timeSpent = <String, double>{
  'Blogging': 10.5,
  'YouTube': 30.5,
  'Courses': 75.2,
};
Here's how you can write a loop to run some code using all the key-value pairs:

for (var entry in timeSpent.entries) {
  // do something with keys and values
  print('${entry.key}: ${entry.value}');
}
By iterating on the entries variable, you have access to all the key-value pairs in a null-safe way.

This is more concise and less error-prone than this:

for (var key in timeSpent.keys) {
  final value = timeSpent[key]!;
  print('$key: $value');
}
The code above requires to use the assertion operator (!) when reading the values, as Dart can't guarantee that a value exists for a given key.

8. Use named constructors and initializer lists for more ergonomic APIs.
Suppose that you want to declare a class that represents a temperature value.

You can make your class API unambiguous and support both Celsius and Fahrenheit with two named constructors:

class Temperature {
  Temperature.celsius(this.celsius);
  Temperature.fahrenheit(double fahrenheit)
    : celsius = (fahrenheit - 32) / 1.8;
  double celsius;
}
This class only needs one stored variable to represent the temperature and uses an initializer list to convert Fahrenheit to Celsius.

This means that you can declare temperature values like this:

final temp1 = Temperature.celsius(30);
final temp2 = Temperature.fahrenheit(90);
9. Getters and setters
In the Temperature class above, celsius is declared as a stored variable.

But users may prefer to get or set the temperature in Fahrenheit.

This is easily done with getters and setters, that allow you to define computed variables. Here's the updated class:

class Temperature {
  Temperature.celsius(this.celsius);
  Temperature.fahrenheit(double fahrenheit)
    : celsius = (fahrenheit - 32) / 1.8;
  double celsius;
  double get fahrenheit
    => celsius * 1.8 + 32;
  set fahrenheit(double fahrenheit)
    => celsius = (fahrenheit - 32) / 1.8;
}
This makes it easy to get or set the temperature with either Fahrenheit or Celsius:

final temp1 = Temperature.celsius(30);
print(temp1.fahrenheit);
final temp2 = Temperature.fahrenheit(90);
temp2.celsius = 28;
Bottom line: use named constructors, getters and setters to improve the design of your classes.

10. Use underscores for unused function arguments
In Flutter we often use widgets that take function arguments. One common example of this is ListView.builder:

class MyListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemBuilder: (context, index) => ListTile(
        title: Text('all the same'),
      ),
      itemCount: 10,
    );
  }
}
In this case, we are not using the (context, index) arguments in the itemBuilder. So we can replace them with underscores instead:

ListView.builder(
  itemBuilder: (_, __) => ListTile(
    title: Text('all the same'),
  ),
  itemCount: 10,
)
Note: the two arguments are different (_ and __) as they are separate identifiers.

11. Need a class that can only be instantiated once (aka singleton)? Use a static instance variable with a private constructor.
The most important property of a singleton is that there can only be one instance of it in your entire program. This is useful to model things like a file system.

// file_system.dart
class FileSystem {
  FileSystem._();
  static final instance = FileSystem._();
}
To create a singleton in Dart you can declare a named constructor and make it private using the _ syntax.

Then you can use it to create one static final instance of your class.

And as a result, any code in other files will only be able to access this class via the instance variable:

// some_other_file.dart
final fs = FileSystem.instance;
// do something with fs
Note: Singletons can lead to many problems if you're not careful. Make sure you understand the disadvantages before using them.

12. Need a collection of unique items? Use a Set rather than a List.
The most commonly used collection type in Dart is a List.

But lists can have duplicate items, and sometimes this is not what we want:

const citiesList = [
  'London',
  'Paris',
  'Rome',
  'London',
];
We can use a Set whenever we need a collection of unique values (note the use of final):

// set is final, compiles
final citiesSet = {
  'London',
  'Paris',
  'Rome',
  'London', // Two elements in a set literal shouldn't be equal
};
The code above generates a warning because London is included twice. If we try doing the same with a const set, we get an error and our code doesn't compile:

// set is const, doesn't compile
const citiesSet = {
  'London',
  'Paris',
  'Rome',
  'London', // Two elements in a constant set literal can't be equal
};
When we work with sets, we have access to useful APIs such as union, difference, and intersection:

citiesSet.union({'Delhi', 'Moscow'});
citiesSet.difference({'London', 'Madrid'});
citiesSet.intersection({'London', 'Berlin'});
Bottom line: when you create a collection, ask yourself if you want its items to be unique, and consider using a set.

13. How to use try, on, catch, rethrow, finally
try and catch are ideal when working with Future-based APIs that may throw an exception if something goes wrong.

Here's a full example showing how to make the most of them:

Future<void> printWeather() async {
  try {
    final api = WeatherApiClient();
    final weather = await api.getWeather('London');
    print(weather);
  } on SocketException catch (_) {
    print('Could not fetch data. Check your connection.');
  } on WeatherApiException catch (e) {
    print(e.message);
  } catch (e, st) {
    print('Error: $e\nStack trace: $st');
    rethrow;
  } finally {
    print('Done');
  }
}
A few notes:

you can add multiple on clauses to handle exceptions of different types.
you can have a fallback catch clause to handle all exceptions that do not match any of the types above.
you can use a rethrow statement to throw the current exception up the call stack while preserving the stack trace.
you can use finally to run some code after the Future has completed, regardless of whether it succeeded or failed.
If you are using or designing some Future-based APIs, make sure to handle exceptions as needed.

14. Common Future constructors
The Dart Future class comes with some handy factory constructors: Future.delayed, Future.value and Future.error.

We can use Future.delayed to create a Future that waits for a certain delay. The second argument is an (optional) anonymous function that you can use to complete with a value or throw an error:

await Future.delayed(Duration(seconds: 2), () => 'Latte');
But sometimes we want to create a Future that completes immediately:

await Future.value('Cappuccino');
await Future.error(Exception('Out of milk'));
We can use Future.value to complete successfully with a value, or Future.error to complete with an error.

You can use these constructors to simulate the response from your Future-based APIs. This is useful when writing mock classes in your test code.

15. Common Stream constructors
The Stream class also comes with some handy constructors. Here are the most common ones:

Stream.fromIterable([1, 2, 3]);
Stream.value(10);
Stream.empty();
Stream.error(Exception('something went wrong'));
Stream.fromFuture(Future.delayed(Duration(seconds: 1), () => 42));
Stream.periodic(Duration(seconds: 1), (index) => index);
use Stream.fromIterable to create a Stream from a list of values.
use Stream.value if you have just one value.
use Stream.empty to create an empty stream.
use Stream.error to create a stream that contains an error value.
use Stream.fromFuture to create a stream that will contain only one value, and that value will be available when the future completes.
use Stream.periodic to create a periodic stream of events. You can specify a Duration as the time interval between events, and an anonymous function to generate each value given its index in the stream.
16. Sync and Async Generators
In Dart we can define a synchronous generator as a function that returns an Iterable:

Iterable<int> count(int n) sync* {
  for (var i = 1; i <= n; i++) {
    yield i;
  }
}
This uses the sync* syntax. Inside the function we can "generate" or yield multiple values. These will be returned as an Iterable when the function completes.

On the other hand, an asynchronous generator is a function that returns a Stream:

Stream<int> countStream(int n) async* {
  for (var i = 1; i <= n; i++) {
    yield i;
  }
}
This uses this async* syntax. Inside the function we can yield values just like in the synchronous case.

But if we want we can await on Future-based APIs, because this is an asynchronous generator:

Stream<int> countStream(int n) async* {
  for (var i = 1; i <= n; i++) {
    // dummy delay - this could be a network request
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}



from: https://codewithandrea.com/videos/top-dart-tips-and-tricks-for-flutter-devs/
