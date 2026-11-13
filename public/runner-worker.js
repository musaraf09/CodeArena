const report = self.postMessage.bind(self)
self.onmessage = async ({ data }) => {
  const { code, functionName, tests, unordered } = data
  try {
    const solution = new Function('"use strict";\n' + code + '\nreturn typeof ' + functionName + ' === "function" ? ' + functionName + ' : null;')()
    if (!solution) throw new Error('Define a function named ' + functionName + '.')
    const results = []
    for (const test of tests) {
      try {
        const actual = await solution(...structuredClone(test.args))
        const normalized = value => unordered && Array.isArray(value) ? [...value].sort((a, b) => a - b) : value
        results.push({ passed: JSON.stringify(normalized(actual)) === JSON.stringify(normalized(test.expected)), actual: actual === undefined ? 'undefined' : JSON.stringify(actual), expected: JSON.stringify(test.expected) })
      } catch (error) { results.push({ passed: false, actual: error.message || String(error), expected: JSON.stringify(test.expected) }) }
    }
    report({ results })
  } catch (error) { report({ error: error.message || String(error) }) }
}
