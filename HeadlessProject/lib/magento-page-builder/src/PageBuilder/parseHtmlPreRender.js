import getContentTypeConfig from './config'

const bodyId = 'html-body'
const pbStyleAttribute = 'data-pb-style'

/**
 * Wrap the htmlStr with DOCTYPE:5
 *
 * @param {any} htmlStr
 * @returns
 */
const convertToDocument = (htmlStr) =>
  `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
            ${htmlStr}
            </body>
        </html>`

/**
 * Convert styles block to inline styles.
 *
 * @param {HTMLDocument} document
 */
const convertToInlineStyles = (document, DOM) => {
  const styleBlocks = document.getElementsByTagName('style')
  const styles = {}

  if (styleBlocks.length > 0) {
    Array.from(styleBlocks).forEach((styleBlock) => {
      const cssRules = styleBlock.sheet.cssRules

      Array.from(cssRules).forEach((rule) => {
        if (rule instanceof DOM.window.CSSStyleRule) {
          const selectors = rule.selectorText.split(',').map((selector) => selector.trim())
          selectors.forEach((selector) => {
            if (!styles[selector]) {
              styles[selector] = []
            }
            styles[selector].push(rule.style)
          })
        }
      })
    })
  }

  Object.keys(styles).forEach((selector) => {
    const element = document.querySelector(selector)
    if (!element) {
      return
    }

    styles[selector].map((style) => {
      element.setAttribute('style', element.style.cssText + style.cssText)
    })
    element.removeAttribute(pbStyleAttribute)
  })
}

/**
 * Create a basic object representing a content type in our tree
 *
 * @param type
 * @param node
 * @returns {{ appearance: any; children: Array; contentType: any }}
 */
const createContentTypeObject = (type, node) => {
  return {
    contentType: type,
    appearance: node ? node.getAttribute('data-appearance') : null,
    children: [],
  }
}

/**
 * This method will only execute during the preRender ie; if !process.browser, so JSDOM will not be
 * part of the FE build
 *
 * @param {any} htmlStr
 */
export const parseHtmlPreRender = (jsdom, htmlStr) => {
  const { JSDOM } = jsdom
  const DOM = new JSDOM(convertToDocument(htmlStr))
  const container = DOM.window.document
  const stageContentType = createContentTypeObject('root-container')
  container.body.id = bodyId
  convertToInlineStyles(container, DOM)

  const virtualDomWalk = (rootEl, contentTypeStructureObj) => {
    const tree = container.createTreeWalker(rootEl, 1 | 4, null, false)

    let currentNode = tree.nextNode()
    while (currentNode) {
      if (currentNode.nodeType !== 1) {
        currentNode = tree.nextNode()
        continue
      }

      const contentType = currentNode.getAttribute('data-content-type')

      if (!contentType) {
        currentNode = tree.nextNode()
        continue
      }

      const props = createContentTypeObject(contentType, currentNode)
      const contentTypeConfig = getContentTypeConfig(contentType)

      if (contentTypeConfig && typeof contentTypeConfig.configAggregator === 'function') {
        try {
          Object.assign(props, contentTypeConfig.configAggregator(currentNode, props))
        } catch (e) {
          console.error(`Failed to aggregate config for content type ${contentType}.`, e)
        }
      } else {
        console.warn(
          `Page Builder ${contentType} content type is not supported, this content will not be rendered.`,
        )
      }

      contentTypeStructureObj.children.push(props)
      virtualDomWalk(currentNode, props)
      currentNode = tree.nextSibling()
    }

    return contentTypeStructureObj
  }

  return virtualDomWalk(container.body, stageContentType)
}
