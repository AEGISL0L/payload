import type { PopulationPromise } from '../types.js'
import type { LinkFeatureServerProps } from './feature.server.js'
import type { SerializedLinkNode } from './nodes/types.js'

import { populate } from '../../../populate/populate.js'
import { recurseNestedFields } from '../../../populate/recurseNestedFields.js'

export const linkPopulationPromiseHOC = (
  props: LinkFeatureServerProps,
): PopulationPromise<SerializedLinkNode> => {
  const linkPopulationPromise: PopulationPromise<SerializedLinkNode> = ({
    context,
    currentDepth,
    depth,
    editorPopulationPromises,
    field,
    findMany,
    flattenLocales,
    node,
    overrideAccess,
    populationPromises,
    req,
    showHiddenFields,
    siblingDoc,
  }) => {
    const promises: Promise<void>[] = []

    if (node?.fields?.doc?.value && node?.fields?.doc?.relationTo) {
      const collection = req.payload.collections[node?.fields?.doc?.relationTo]

      if (collection) {
        promises.push(
          populate({
            id:
              typeof node?.fields?.doc?.value === 'object'
                ? node?.fields?.doc?.value?.id
                : node?.fields?.doc?.value,
            collection,
            currentDepth,
            data: node?.fields?.doc,
            depth,
            field,
            key: 'value',
            overrideAccess,
            req,
            showHiddenFields,
          }),
        )
      }
    }
    if (Array.isArray(props.fields)) {
      recurseNestedFields({
        context,
        currentDepth,
        data: node.fields || {},
        depth,
        editorPopulationPromises,
        fields: props.fields,
        findMany,
        flattenLocales,
        overrideAccess,
        populationPromises,
        promises,
        req,
        showHiddenFields,
        siblingDoc: node.fields || {},
      })
    }
    return promises
  }

  return linkPopulationPromise
}
