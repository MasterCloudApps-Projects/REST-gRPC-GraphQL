# REST
REST (Representational state transfer) was first introduced in [Roy Fielding's doctoral dissertation Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm), and it is described as an _architectural style for distributed hypermedia systems_. It is important to notice two key points here:

1. It is an _architectural style_, not a _protocol_. For example, SOAP is a protocol. REST, on the other side, is an architectural style which make use of standards, but there is no official standard for REST. Because of this, we often find different solutions to a given problem.
2. It is for _distributed hypermedia systems_. Clients have access to hypermedia information from a repository which might be in a distributed network.

In REST, we define _resources_ (for example, books), that can be _represented_ in a variety of forms (namely, XML or JSON). When we talk about _state_, we are referring to the current data or version of a _resource_. Taking this into account, REST is just a means for two systems to _transfer_ the _state_ of a _resource_ through one of its _representations_.

> Note: we've covered _resource states_. We also have the _application state_, which resides on the client side. It can transition to other states just following the links in the _representations_.

A service which fully adheres to the REST specification is said to be a _RESTful Service_. Also note that, according to Roy's dissertation, _"REST does not restrict communication to a particular protocol"_. Most of the time it is Web-based. In such case, we would call it a _RESTful Web Service_.

## Constraints
REST encompasses six constraints:

* **Client-Server** - the principle behind this is the separation of concerns provided by this architectural style.
* **Stateless** - a stateless communication --session state is kept on the client-- leads to _visibility_, _reliability_ and _scalability_.
  * **Visibility** - If we use a visible protocol, like HTTP, other components like a firewall or a proxy, can monitor and collaborate.
  * **Scalability** - Since the server does not store any state, a certain request can be handled by any server.
* **Cache** - this reduces the number of interactions, which improves the efficiency and thus the user experience.
* **Layered System** - or Microservices. Clients can only see the immediate layer they are interacting with. This layer may be composed of a hiearchy of layers.
* **Code-On-Demand** (optional) - servers can provide clients with executable code (scripts).
* **Uniform Interface** - consists in a common interface to let each side (client and server) to evolve independently. Here is a list of each constraint and how they are enforced in a RESTful Web Service:
  * **Identification of resources** - each single resource has an identifier. For this, we use URIs.
  * **Manipulation of resources through representations** - resources state can be manipulated by a client using a representation. In RESTful Web Services, the HTTP standard is used. There are no verbs in REST, but not because HTTP already has verbs, but because we transfering a _state_, rather than calling instructions.
  * **self-descriptive messages** - each message gives precise information about how to describe itself. The [Media Type (formerly known as MIME types)](https://www.iana.org/assignments/media-types/media-types.xhtml) is used to make messages self-descriptive, for example, using [`application/vnd.api+json`](https://jsonapi.org/).
  * **Hypermedia as the engine of application state (HATEOAS)** - Application state transition are carried out through hypermedia in the resource returned by the server.

## Richardson Maturity Model
The so called [Richardson Maturity Model](https://www.crummy.com/writing/speaking/2008-QCon/act3.html) describes different levels on how RESFull a Web Service is:

* **Level Zero** - One URI and one HTTP method. Example: XML-RPC or SOAP.
* **Level One** - Many URIs and one HTTP method.
* **Level Two** - Many URIs and multiple HTTP methods.
* **Level Four** - Hypermedia: leverage links and forms.

## Resources
Resources can be any information that can be named: a document, a collection of documents, a temporal service ("today's weather in Madrid"), etc. There is no consensus about how to model resources, but very often the following patterns are suggested (please note, this is not part of the REST specification):

### Document
Represents a single piece of information (like a row in a database), and can be composed of value-fields and links. For example, a specific univerisity, like "Universidad Rey Juan Carlos" can be a _document resource_.

### Collection
A _collection resource_ is a container of other resources. Clients can request to create a new resource into the collection, but it's up to the server whether to create it or not. The identifier of the resource is generated by the server.

### Store
As _collections_, _store resources_ works as repositories of resources. But unlike _collections_, the creation of the resource is client-managed, which means the identifier is provided by the client.

### Controller
_Controller resources_ can be thought as remote methods: they represent an action, accept input parameters and return a value. These can be used to map procedures that do not match any CRUD action, for example to run a number of operations (merge two contacts), or to carry out an operation whose matching CRUD action is not obvious. Each of these resources will have their own identifier to avoid _tunnelling_.

> By tunnelling we mean using the same operation on the same identifier to perform different actions. SOAP over HTTP or XML-RPC are examples of tunnelling, because they use POST calls to a single URI to perform different operations: they both would delete a resource performing a POST call.