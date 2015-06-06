describe('Tests for ColumnCopy', function() {
    function forEach(fixtureName) {
        var rows;
        var spec;
        beforeEach(function() {
            jasmine.getFixtures().fixturesPath = './';
            var fixture = readFixtures(fixtureName);
            setFixtures(fixture);
            var m = /<!--([\S\s]*?)-->/.exec(fixture);
            spec = JSON.parse(m[1]);
            var $table = $('table:first');
            var _ColumnCopy = new ColumnCopy();
            _ColumnCopy.options = {
                hyperlinkMode: 'off',
                columnSeperator: '\t'};
            rows = _ColumnCopy.getValuesForTable($table);
        });
        it('DOM Parser check for ' + fixtureName, function() {
            expect(rows).toEqual(spec.rows);
        });
    }
    forEach('test1.html');
    forEach('test8.html');
});
