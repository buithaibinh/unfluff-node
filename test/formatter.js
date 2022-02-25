/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
suite('Formatter', function() {
  const formatter = require("../src/formatter");
  const cheerio = require("cheerio");

  test('exists', () => ok(formatter));

  test('replaces links with plain text', function() {
    const html = fs.readFileSync("./fixtures/test_businessWeek1.html").toString();
    const origDoc = cheerio.load(html, {normalizeWhitespace: true, xml: true});

    eq(origDoc("a").length, 232);

    formatter(origDoc, origDoc('body'), 'en');
    return eq(origDoc("a").length, 0);
  });

  return test('doesn\'t drop text nodes accidentally', function() {
    let html = fs.readFileSync("./fixtures/test_wikipedia1.html").toString();
    const doc = cheerio.load(html);

    formatter(doc, doc('body'), 'en');
    html = doc.html();
    // This text was getting dropped by the formatter
    return ok(/is a thirteen episode anime series directed by Akitaro Daichi and written by Hideyuki Kurata/.test(html));
  });
});
