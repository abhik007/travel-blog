import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import Layout from "../components/layout"
import Nav from "../components/nav"
import SEO from "../components/seo"
import "./blog.css"

const Bold = ({ children }) => <span className="bold">{children}</span>
const Text = ({ children }) => <p className="align-center">{children}</p>

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ASSET]: node => {
      return <div className="embedded_assets"></div>
    }
  },
}

const BlogTemplate = (props) => {
  useEffect(() => {
    {document.querySelectorAll(".embedded_assets").forEach((node, index) => {
      node.innerHTML = `<img src=${props.data.contentfulBlog.content.references[index].fixed.src} class=${ index === 1 ? 'right' : 'center' } alt="blog_image" />`
    })}
  }, [])

  return (
    <Layout>
      <SEO
        title={props.data.contentfulBlog.seoTitle}
        description={props.data.contentfulBlog.seoDescription}
        keywords={props.data.contentfulBlog.seoKeywords}
      />
      <Nav />
      <div className="blog__header">
        <div
          className="blog__hero"
          style={{
            backgroundImage: `url(${props.data.contentfulBlog.featuredImage.fluid.src})`,
          }}
        ></div>
        <div className="blog__info">
          <h1 className="blog__title">{props.data.contentfulBlog.title}</h1>
        </div>
      </div>
      <div className="blog__wrapper">
        <div className="blog__content">
          {renderRichText(props.data.contentfulBlog.content, options)}
          {/* {console.log(props.data.contentfulBlog.content)} */}
        </div>
      </div>
    </Layout>
  )
}

export default BlogTemplate

export const query = graphql`
  query BlogTemplate($id: String!) {
    contentfulBlog(id: { eq: $id }) {
      title
      id
      slug
      content {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            fixed(width: 1600) {
              width
              height
              src
              srcSet
            }
          }
        }
      }
      seoTitle
      seoDescription
      seoAuthor
      seoKeywords
      seoImage {
        fluid(maxWidth: 1200, quality: 100) {
          ...GatsbyContentfulFluid
          src
        }
      }
      featuredImage {
        fluid(maxWidth: 1200, quality: 100) {
          ...GatsbyContentfulFluid
          src
        }
      }
    }
  }
`
