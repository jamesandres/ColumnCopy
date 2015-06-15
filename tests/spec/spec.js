describe('ColumnCopy', function() {
  function runTest(fixtureName) {
    var rows;
    var spec;

    beforeEach(function() {
      var fixture, m, $table, _ColumnCopy

      jasmine.getFixtures().fixturesPath = './';
      fixture = readFixtures(fixtureName);
      setFixtures(fixture);
      m = /<!--([\S\s]*?)-->/.exec(fixture);
      spec = JSON.parse(m[1]);

      $table = $('table:first');

      _ColumnCopy = new ColumnCopy();

      _ColumnCopy.options = {
        hyperlinkMode: 'off',
        columnSeparator: '\t'
      };

      rows = _ColumnCopy.getValuesForTable($table);
    });

    it('correctly get values via ColumnCopy.getValuesForTable: ' + fixtureName, function() {
      expect(rows).toEqual(spec.rows);
    });
  }

  runTest('test1.html');
  runTest('test2.html');
  runTest('test3.html');
  runTest('test4.html');
  runTest('test5.html');
  runTest('test6.html');
  runTest('test7.html');
  runTest('test8.html');
});
