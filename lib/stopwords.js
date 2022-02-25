/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let stopwords;
const each = require('lodash/each');
const stopwordsData = require('./stopwordsdata');

const cache = {};

// Given a language, loads a list of stop words for that language
// and then returns which of those words exist in the given content
module.exports = (stopwords = function(content, language) {

  if (language == null) { language = 'en'; }
  let stopWords = stopwordsData[ language ];

  if (!stopWords) {
    console.error(`WARNING: No stopwords file found for '${language}' - defaulting to English!`);
    stopWords = stopwordsData[ 'en' ];
  }

  if (cache.hasOwnProperty(language)) {
    stopWords = cache[language];
  } else {
    cache[language] = stopWords;
  }

  const strippedInput = removePunctuation(content);
  const words = candiateWords(strippedInput);
  const overlappingStopwords = [];

  let count = 0;

  each(words, function(w) {
    count += 1;
    if (stopWords.indexOf(w.toLowerCase()) > -1) {
      return overlappingStopwords.push(w.toLowerCase());
    }
  });

  return {
    wordCount: count,
    stopwordCount: overlappingStopwords.length,
    stopWords: overlappingStopwords
  };
});

var removePunctuation = content => content.replace(/[\|\@\<\>\[\]\"\'\.,-\/#\?!$%\^&\*\+;:{}=\-_`~()]/g,"");

var candiateWords = strippedInput => strippedInput.split(' ');
