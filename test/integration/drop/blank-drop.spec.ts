import { Liquid } from '../../../src/liquid'

describe('drop/blank-drop', function () {
  let liquid: Liquid
  beforeEach(() => (liquid = new Liquid()))

  it('render blank drop as blank string', async function () {
    const html = await liquid.parseAndRender('{{blank}}')
    expect(html).toBe('')
  })
  it('blank equals nil', async function () {
    const src = '{%if blank == nil %}blank == nil{%else%}blank != nil{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('blank == nil')
  })
  it('false is blank', async function () {
    const src = '{%if false == blank %}false == blank{%else%}false != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('false == blank')
  })
  it('"" is blank', async function () {
    const src = '{%if "" == blank %}"" == blank{%else%}"" != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"" == blank')
  })
  it('"  " is blank', async function () {
    const src = '{%if "  " == blank %}"  " == blank{%else%}"  " != blank{% endif %}'
    const html = await liquid.parseAndRender(src)
    expect(html).toBe('"  " == blank')
  })
  it('{} is blank', async function () {
    const src = '{%if obj == blank %}{} == blank{%else%}{} != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: {} })
    expect(html).toBe('{} == blank')
  })
  it('{foo: 1} is not blank', async function () {
    const src = '{%if obj == blank %}{foo: 1} == blank{%else%}{foo: 1} != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { obj: { foo: 1 } })
    expect(html).toBe('{foo: 1} != blank')
  })
  it('[] is blank', async function () {
    const src = '{%if arr == blank %}[] == blank{%else%}[] != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [] })
    expect(html).toBe('[] == blank')
  })
  it('[1] is not blank', async function () {
    const src = '{%if arr == blank %}[1] == blank{%else%}[1] != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { arr: [1] })
    expect(html).toBe('[1] != blank')
  })
  it('new Set() is blank', async function () {
    const src = '{%if tags == blank %}new Set() == blank{%else%}new Set() != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { tags: new Set() })
    expect(html).toBe('new Set() == blank')
  })
  it('new Set([1]) is not blank', async function () {
    const src = '{%if tags == blank %}new Set([1]) == blank{%else%}new Set([1]) != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { tags: new Set([1]) })
    expect(html).toBe('new Set([1]) != blank')
  })
  it('new Map() is blank', async function () {
    const src = '{%if stock == blank %}new Map() == blank{%else%}new Map() != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { stock: new Map() })
    expect(html).toBe('new Map() == blank')
  })
  it('new Map([["red", 3]]) is not blank', async function () {
    const src = '{%if stock == blank %}new Map([["red", 3]]) == blank{%else%}new Map([["red", 3]]) != blank{% endif %}'
    const html = await liquid.parseAndRender(src, { stock: new Map([['red', 3]]) })
    expect(html).toBe('new Map([["red", 3]]) != blank')
  })
})
