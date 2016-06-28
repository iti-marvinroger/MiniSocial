'use strict';

const cytoscape = require('cytoscape');

/*
* Question 1
*/
let currentId = 0;
class Person {
  constructor (firstName, lastName, email) {
    this.id = currentId++;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

class MiniSocial {
  constructor () {
    this.graph = cytoscape();
  }

  addPerson (person) {
    // Add a node to the graph
    this.graph.add({
      group: 'nodes',
      data: { id: person.id, person }
    });
  }

  addRelation (type, relation) {
    // Add an edge between the two nodes representing the two concerned persons
    this.graph.add({
      group: 'edges',
      data: { id: relation[0].id + '-' + relation[1].id, type, source: relation[0].id, target: relation[1].id }
    });
  }

  /*
  * Question 2
  */
  areInContact(candidates) {
    // Apply Dijkstra and see if the distance is Infinity or not
    const a = this.graph.getElementById(candidates[0].id);
    const b = this.graph.getElementById(candidates[1].id);

    const depth = this.graph.elements().dijkstra(a).distanceTo(b);

    const payload = { contact: depth !== Infinity };
    if (payload.contact) {
      if (depth === 1) {
        payload.direct = true;
      } else {
        payload.direct = false;
        payload.depth = depth;
      }
    }

    return payload;
  }

  /*
  * Question 3
  */
  getAllContactable(candidate) {
    // Recurse the whole graph starting from the candidate
    const a = this.graph.getElementById(candidate.id);

    const payload = [];

    this.graph.elements().bfs({ roots: a, visit: function (ith, depth, current) {
      if (current === a) return;

      payload.push({ person: this.data('person'), depth });
    }});

    return payload;
  }

  /*
  * Question 4
  */
  getNearestPath(candidates) {
    // Apply Dijkstra to get the shorter path between the candidates
    const a = this.graph.getElementById(candidates[0].id);
    const b = this.graph.getElementById(candidates[1].id);

    const path = this.graph.elements().dijkstra(a).pathTo(b);

    const payload = [];

    for (let i = 1; i < path.length - 1; i++) {
      const element = path[i];

      if (element.group() === 'edges') continue;

      payload.push(element.data('person'));
    }

    return payload;
  }

  /*
  * Question 5
  */
  getLongestPath(candidates) {
    // Not implemented
  }

}

const miniSocial = new MiniSocial();

const john = new Person('John', 'Doe', 'johndoe@gmail.com');
const craig = new Person('Craig', 'Kang', 'craigkang@gmail.com');
const seth = new Person('Seth', 'Fly', 'sethfly@gmail.com');
const bob = new Person('Bob', 'Marc', 'bobmarc@gmail.com');
const julie = new Person('Julie', 'Ili', 'julieili@gmail.com');

miniSocial.addPerson(john);
miniSocial.addPerson(craig);
miniSocial.addPerson(seth);
miniSocial.addPerson(bob);
miniSocial.addPerson(julie);
miniSocial.addRelation('friends', [john, craig]);
miniSocial.addRelation('friends', [craig, seth]);
miniSocial.addRelation('friends', [seth, julie]);
miniSocial.addRelation('friends', [julie, bob]);

console.log('** Are John and Craig in contact? **\n\n');
console.log(miniSocial.areInContact([john, craig]));

console.log('\n\n** Show everyone Julie can contact **\n\n');
console.log(miniSocial.getAllContactable(julie));

console.log('\n\n** Show the nearest person path between John and Bob **\n\n');
console.log(miniSocial.getNearestPath([john, bob]));