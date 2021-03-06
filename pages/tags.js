import React from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import DefaultSiteWrapper from '../components/DefaultSiteWrapper'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import groupBy from 'lodash/groupBy'
import kebabCase from 'lodash/kebabCase'
import sortBy from 'lodash/sortBy'

class TagsPageRoute extends React.Component {
  render () {
    console.log(this.props)
    const posts = this.props.data.allMarkdown.edges
    const title = get(this.props, 'data.config.siteMetadata.title')
    let allTags = posts.reduce((tags, post) => {
      if (post.node.frontmatter.draft !== true && post.node.frontmatter.tags) {
        tags = tags.concat(post.node.frontmatter.tags)
      }

      return tags
    }, [])

    const groupedTags = groupBy(allTags, (tag) => tag.toLowerCase())
    allTags = Object.keys(groupedTags)
    allTags = sortBy(allTags, (tag) => tag.toLowerCase())

    const tagLinks = allTags.map((tag) => (
      <li
        key={tag}
      >
        <Link
          style={{
            textDecoration: 'none',
          }}
          to={`/tags/${kebabCase(tag)}/`}
        >
          {tag} ({groupedTags[tag].length})
        </Link>
      </li>
    ))

    return (
      <DocumentTitle title={title}>
        <DefaultSiteWrapper {...this.props}>
          <div>
            <h1>Tags</h1>
            <ul>
              {tagLinks}
            </ul>
          </div>
        </DefaultSiteWrapper>
      </DocumentTitle>
    )
  }
}

export default TagsPageRoute

export const routeQuery = `
  {
    config {
      siteMetadata {
        title
      }
    }
    allMarkdown(first: 2000) {
      edges {
        node {
          frontmatter {
            tags
            draft
          }
        }
      }
    }
  }
`

