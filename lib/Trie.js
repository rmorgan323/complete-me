import { Node } from './Node.js';

export class Trie {
  constructor() {
    this.root = new Node('');
    this.count = 0;
  }

  insert(word) { 
    word = word.toLowerCase();
    word = word.split('');

    let currentNode = this.root;

    word.forEach(letter => {
      if (!currentNode.children[letter]) {
        currentNode.children[letter] = new Node(letter);
      }
      currentNode = currentNode.children[letter];
    });

    if (!currentNode.wordEnd) {
      this.count++;
      currentNode.wordEnd = true;
    }
  }

  suggest(phrase) {
    phrase = phrase.toLowerCase();
    phrase = phrase.split('');

    let currentNode = this.root;

    phrase.forEach(letter => {
      if (currentNode && currentNode.children) {
        currentNode = currentNode.children[letter];
      }
    });

    if (!currentNode || !currentNode.children) {
      return [];
    } else {
      return this.findSuggestions(currentNode, phrase.join(''));
    }
  }

  findSuggestions(currentNode, phrase, suggestions = []) {
    let childrenLetters = Object.keys(currentNode.children);

    childrenLetters.forEach(childLetter => {
      let letterNode = currentNode.children[childLetter];
      let newPhrase = phrase + childLetter;

      if (letterNode.wordEnd) {
        suggestions.push({
          word: newPhrase, popCount: 
          letterNode.popularity});
      }
      this.findSuggestions(letterNode, newPhrase, suggestions);
    });

    suggestions.sort((a, b) => {
      return b.popCount - a.popCount;
    });

    return suggestions.map(wordObj => {
      return wordObj.word;
    });
  }

  populate(wordList) {
    wordList.forEach(word => {
      this.insert(word);
    });
  }

  select(word) {
    let currentNode = this.root;

    word = word.split('');
    word.forEach(letter => {
      currentNode = currentNode.children[letter];
    });
    currentNode.popularity++;
  }
		
}

