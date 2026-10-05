import { Liquid } from '../../src/liquid'

describe('Set and Map collections', function () {
  const liquid = new Liquid()
  // Sets and Maps should behave like arrays in templates:
  // - Set: an array of its values in insertion order
  // - Map: an array of [key, value] pairs in insertion order
  const tags = new Set(['sale', 'new', 'hot'])
  const stock = new Map<string, number>([['red', 3], ['blue', 5]])

  describe('filters', function () {
    it('should report Set size', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | size }}', { tags })).toBe('3')
    })
    it('should report Map size', () => {
      return expect(liquid.parseAndRenderSync('{{ stock | size }}', { stock })).toBe('2')
    })
    it('should support first/last filters on Set', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | first }}|{{ tags | last }}', { tags })).toBe('sale|hot')
    })
    it('should support first/last filters on Map', () => {
      const src = '{{ stock | first | join: "=" }}|{{ stock | last | join: "=" }}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('red=3|blue=5')
    })
    it('should support dot first/last on Set', () => {
      return expect(liquid.parseAndRenderSync('{{ tags.first }}|{{ tags.last }}', { tags })).toBe('sale|hot')
    })
    it('should support dot first/last on Map', () => {
      const src = '{{ stock.first | join: "=" }}|{{ stock.last | join: "=" }}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('red=3|blue=5')
    })
    it('should join Set values', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | join: "," }}', { tags })).toBe('sale,new,hot')
    })
    it('should join Map entries', () => {
      return expect(liquid.parseAndRenderSync('{% for pair in stock %}{{ pair | join: "=" }}{% unless forloop.last %};{% endunless %}{% endfor %}', { stock })).toBe('red=3;blue=5')
    })
    it('should sort then join a Set', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | sort | join: "," }}', { tags })).toBe('hot,new,sale')
    })
    it('should reverse then join a Set', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | reverse | join: "," }}', { tags })).toBe('hot,new,sale')
    })
    it('should concat a Set with an empty Set element-wise', () => {
      const src = '{% assign x = tags | concat: emptySet %}{{ x | size }}'
      return expect(liquid.parseAndRenderSync(src, { tags, emptySet: new Set() })).toBe('3')
    })
    it('should concat two Sets element-wise', () => {
      const src = '{% assign x = tags | concat: more %}{{ x | join: "," }}'
      const more = new Set(['x'])
      return expect(liquid.parseAndRenderSync(src, { tags, more })).toBe('sale,new,hot,x')
    })
    it('should return empty for first/last on empty Set', () => {
      return expect(liquid.parseAndRenderSync('{{ emptySet | first }}|{{ emptySet | last }}', { emptySet: new Set() })).toBe('|')
    })
    it('should return empty for first/last on empty Map', () => {
      return expect(liquid.parseAndRenderSync('{{ emptyMap | first }}|{{ emptyMap | last }}', { emptyMap: new Map() })).toBe('|')
    })
    it('should support slice on Set', () => {
      return expect(liquid.parseAndRenderSync('{{ tags | slice: 1, 2 | join: "," }}', { tags })).toBe('new,hot')
    })
  })

  describe('contains operator', function () {
    it('should check membership on Set', () => {
      const src = '{% if tags contains "new" %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { tags })).toBe('yes')
    })
    it('should be false for missing Set element', () => {
      const src = '{% if tags contains "missing" %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { tags })).toBe('no')
    })
    it('should check keys on Map', () => {
      const src = '{% if stock contains "red" %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('yes')
    })
    it('should be false for missing Map key', () => {
      const src = '{% if stock contains "green" %}yes{% else %}no{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('no')
    })
  })

  describe('empty/blank', function () {
    it('should not treat a non-empty Set as empty', () => {
      const src = '{% if tags == empty %}empty{% else %}notempty{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { tags })).toBe('notempty')
    })
    it('should not treat a non-empty Set as blank', () => {
      const src = '{% if tags == blank %}blank{% else %}notblank{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { tags })).toBe('notblank')
    })
    it('should treat an empty Set as empty', () => {
      const src = '{% if emptySet == empty %}empty{% else %}notempty{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { emptySet: new Set() })).toBe('empty')
    })
    it('should treat an empty Set as blank', () => {
      const src = '{% if emptySet == blank %}blank{% else %}notblank{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { emptySet: new Set() })).toBe('blank')
    })
    it('should not treat a non-empty Map as empty', () => {
      const src = '{% if stock == empty %}empty{% else %}notempty{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('notempty')
    })
    it('should treat an empty Map as empty', () => {
      const src = '{% if emptyMap == empty %}empty{% else %}notempty{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { emptyMap: new Map() })).toBe('empty')
    })
    it('should treat an empty Map as blank', () => {
      const src = '{% if emptyMap == blank %}blank{% else %}notblank{% endif %}'
      return expect(liquid.parseAndRenderSync(src, { emptyMap: new Map() })).toBe('blank')
    })
  })

  describe('iteration', function () {
    it('should iterate a Set in insertion order', () => {
      const src = '{% for t in tags %}{{ t }};{% endfor %}'
      return expect(liquid.parseAndRenderSync(src, { tags })).toBe('sale;new;hot;')
    })
    it('should iterate a Map as [key, value] pairs', () => {
      const src = '{% for pair in stock %}{{ pair[0] }}={{ pair[1] }};{% endfor %}'
      return expect(liquid.parseAndRenderSync(src, { stock })).toBe('red=3;blue=5;')
    })
  })

  describe('dot size', function () {
    it('should read Set.size', () => {
      return expect(liquid.parseAndRenderSync('{{ tags.size }}', { tags })).toBe('3')
    })
    it('should read Map.size', () => {
      return expect(liquid.parseAndRenderSync('{{ stock.size }}', { stock })).toBe('2')
    })
  })
})
