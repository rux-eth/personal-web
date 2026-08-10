import { categories, Tag } from '@src/components/category'
import Link from '@src/components/link'
import {
  compileTags,
  defaultThumbnail,
  tagCounts,
  WorkInfo
} from '@src/data/works'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import Image from 'next/image'
import { FC, Fragment, JSX, useState } from 'react'
import {
  FaArrowDown,
  FaGithub,
  FaGlobe,
  FaMedium,
  FaTrello
} from 'react-icons/fa'
import { CommentedContent, CommentedHeader } from './commented'
import Contact, { ContactItem } from './contact'
import Layout from './layouts/pages'
import Seperator from './seperator'

export const WorkPreviews: FC<{
  works: readonly WorkInfo[]
  filters?: ReadonlySet<Tag>
}> = ({ works, filters }) => {
  const fs = dynamicFont(100)
  const filt = filters ? [...filters] : undefined
  const shown =
    filt && filt.length > 0
      ? works.filter(elem => filt.some(tag => compileTags(elem).has(tag)))
      : works
  return (
    <>
      {shown.map(elem => {
        const { id, title, description, thumbnail } = elem
        const tags = [...compileTags(elem)]
        return (
          <div
            key={id}
            className="w-full text-center opacity-75 hover:opacity-100 duration-300"
            style={{
              fontSize: fs
            }}
            id={id}
          >
            <Link href={`/works/${id}`} style={{ textDecoration: 'none' }}>
              <div className="cursor-pointer flex flex-col space-y-[2%] font-Menlo text-bold">
                <Image
                  src={thumbnail}
                  alt={title}
                  width={1980}
                  height={1080}
                  className="grid-item-thumbnail rounded-lg"
                  // Explicit box: pre-13 next/image stretched every thumbnail
                  // into the 1980:1080 frame; modern height:auto follows each
                  // file's natural ratio instead, changing card heights. Pin
                  // the authored frame (content stretches via object-fit fill,
                  // as before). PR-009 revisits true image sizing.
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1980 / 1080'
                  }}
                />
                <p className="font-bold text-[1.4ch]">{title}</p>
                <p
                  className="text-[0.8ch] opacity-90"
                  style={{
                    lineHeight: '2.2ch',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3
                  }}
                >
                  {description}
                </p>

                <div
                  className="flex justify-center text-[0.8ch]"
                  style={{
                    flexWrap: 'wrap',
                    gap: '0.4ch'
                  }}
                >
                  {tags.map(tag => categories[tag])}
                </div>
              </div>
            </Link>
          </div>
        )
      })}
    </>
  )
}

export const WorksPage: FC<{ works: readonly WorkInfo[] }> = ({ works }) => {
  // constants
  const [isList, setIsList] = useState(false)
  const fs = dynamicFont(100)
  const [filters, setFilters] = useState(new Set<Tag>())
  const handleFilterChange = (filter: Tag) => {
    const next = new Set(filters)
    if (next.has(filter)) {
      next.delete(filter)
    } else {
      next.add(filter)
    }
    setFilters(next)
  }
  // main
  return (
    <Layout title="Works">
      <div
        className="text-white text-center items-center px-6 md:px-14 font-Menlo"
        style={{
          fontSize: fs
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div>
            <div
              onClick={() => setIsList(!isList)}
              className="white-comp flex items-center cursor-pointer mt-[1ch]"
            >
              Filter Tags
              <div
                style={{
                  marginLeft: '0.5ch',
                  // D9 fix: was `isList ? 'rotate(0.5)turn' : 'rotate(0.5)turn'`
                  // — identical branches AND a malformed CSS value, so the
                  // arrow never rotated.
                  transform: isList ? 'rotate(0.5turn)' : 'none',
                  transitionDuration: '300ms'
                }}
              >
                <FaArrowDown />
              </div>
            </div>
            <div
              className="absolute p-[0.3ch] left-[50%] w-[20ch] text-white shadow-sm rounded-[0.5ch] z-10 bg-black"
              style={{
                opacity: isList ? '100%' : '0%',
                transitionDuration: '300ms',
                visibility: isList ? 'visible' : 'hidden',
                transform: 'translateX(-50%)',
                colorScheme: 'dark',
                border: '2px solid rgba(255,255,255,1)'
              }}
            >
              <div
                className="relative max-h-[18ch] overflow-auto px-[1.3ch]"
                style={{}}
              >
                {Object.entries(tagCounts(works)).map(
                  ([mainTag, subTags]): JSX.Element => (
                    <Fragment key={mainTag}>
                      <div className="flex items-center justify-between py-[0.2ch]">
                        <div className="flex items-center">
                          <p className="text-[1.5ch] leading-normal font-bold">{`${mainTag}`}</p>
                        </div>
                        <p className="text-[1.5ch] text-blue-300">
                          {`${Object.values(subTags).reduce(
                            (p: number, c) => p + (c ?? 0),
                            0
                          )}`}
                        </p>
                      </div>
                      <div className="space-y-[0.3ch]">
                        {(Object.entries(subTags) as Array<[Tag, number]>).map(
                          ([subTag, nums]): JSX.Element => (
                            <button
                              key={subTag}
                              className="white-comp w-full flex items-center justify-between"
                              onClick={() => handleFilterChange(subTag)}
                              style={{
                                background: filters.has(subTag)
                                  ? 'white'
                                  : 'black'
                              }}
                            >
                              <div className=" flex items-center">
                                <p className="text-[1ch] text-black ">
                                  {filters.has(subTag)
                                    ? subTag.charAt(0).toUpperCase() +
                                      subTag.slice(1)
                                    : categories[subTag]}
                                </p>
                              </div>
                              <p
                                className="w-8 text-[1ch] leading-3 text-right text-blue-300"
                                style={{
                                  color: filters.has(subTag) ? 'black' : ''
                                }}
                              >
                                {`${nums}`}
                              </p>
                            </button>
                          )
                        )}
                      </div>
                    </Fragment>
                  )
                )}
              </div>
              <div className="bg-black">
                <div className="grid grid-cols-2 gap-2 p-2 justify-items-stretch">
                  <button
                    className="bg-red-500 rounded-[0.5ch]"
                    onClick={() => setFilters(new Set())}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-blue-500 rounded-[0.5ch]"
                    onClick={() => setIsList(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
            <style>
              {` .checkbox:checked + .check-icon {
              display: flex;
          }`}
            </style>
          </div>
        </div>
        <div
          className="flex justify-center m-[1ch]"
          style={{
            fontSize: '1.5ch',
            flexWrap: 'wrap',
            gap: '.4ch'
          }}
        >
          {[...filters].map(filter => (
            <button
              key={filter}
              className="my-[-0.31ch]"
              onClick={() => handleFilterChange(filter)}
            >
              {categories[filter]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 p-6 my-[3ch]">
          <WorkPreviews works={works} filters={filters} />
        </div>
      </div>
    </Layout>
  )
}

export const WorkPage: FC<{ work: WorkInfo }> = ({ work }) => {
  const fs = dynamicFont(100)
  // constants
  const {
    title,
    description,
    thumbnail,
    status,
    role,
    languages,
    stack,
    repo,
    website,
    article,
    trello
  } = work
  const links: { [key: string]: JSX.Element } = {}
  const contacts: ContactItem[] = []
  const defStyle = {
    display: 'inline',
    transform: 'scale(115%)'
  }
  const DefaultLink: FC<{ children: any; href: string }> = ({
    children,
    href
  }) => {
    return (
      <Link
        href={href}
        target="_blank"
        className="text-[#DDDDDD] hover:text-white hover:cursor-pointer"
        style={{ transition: 'all 500ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {children}
      </Link>
    )
  }

  if (repo) {
    links.Repository = (
      <DefaultLink href={repo}>
        <FaGithub style={defStyle} />
      </DefaultLink>
    )
    contacts.push({
      title: 'Repository',
      value: repo,
      link: repo
    })
  }
  if (website) {
    links.Website = (
      <DefaultLink href={website}>
        <FaGlobe style={defStyle} />
      </DefaultLink>
    )
    contacts.push({
      title: 'Website',
      value: website,
      link: website
    })
  }
  if (article) {
    links.Article = (
      <DefaultLink href={article}>
        <FaMedium style={defStyle} />
      </DefaultLink>
    )
    contacts.push({
      title: 'Article',
      value: article,
      link: article
    })
  }
  if (trello) {
    links.Progress = (
      <DefaultLink href={trello}>
        <FaTrello style={defStyle} />
      </DefaultLink>
    )
    contacts.push({
      title: 'Progress',
      value: trello,
      link: trello
    })
  }
  const ItemsJSON: FC<{
    cat: string
    items: Tag[] | JSX.Element
  }> = ({ cat, items }) => {
    return Array.isArray(items) ? (
      // div, not p: a div inside p is invalid HTML — the SSG'd markup would be
      // re-nested by the browser parser and break hydration/layout. Box-model
      // identical (no element styles on p; preflight zeroes both).
      <div className="pl-[3ch]">
        {`"${cat}": [`}
        <div className="space-y-[1px] scale-95">
          {items.map((tag, index, arr) => (
            <div key={tag}>
              <span className="pl-[2ch]">
                {categories[tag]}
                {index < arr.length - 1 && ','}
              </span>
            </div>
          ))}
        </div>
        {'],'}
      </div>
    ) : (
      <p className="pl-[3ch]">
        {`"${cat}": `}
        {''}
        <span className="">{items}</span>
        {','}
      </p>
    )
  }
  const BuildJSON: FC = () => {
    return (
      <div className="mx-auto opacity-80 text-[1.3ch]">
        {'const Details = {'}
        <br />
        {stack.length > 0 && <ItemsJSON cat="Stack" items={[...stack]} />}
        {languages.length > 0 && (
          <ItemsJSON cat="Languages" items={[...languages]} />
        )}
        {status && <ItemsJSON cat="Status" items={categories[status]} />}
        <ItemsJSON cat="Role" items={categories[role]} />
        {Object.keys(links).length > 0 && (
          <div className="pl-[6ch]">
            {`"Links": {`}
            {Object.entries(links).map(([key, val]) => (
              <ItemsJSON key={key} cat={key} items={val} />
            ))}
            {'},'}
          </div>
        )}

        {'}'}
      </div>
    )
  }
  return (
    <Layout title={title}>
      <div
        className="flex flex-col space-y-3 text-white font-Menlo py-5"
        style={{
          fontSize: fs
        }}
      >
        <CommentedContent header="Description" content={description} />
        <Seperator />
        {contacts.length > 0 && (
          <div className="text-[1.3ch]">
            <div className="my-[-2ch]">
              <CommentedHeader content="Links" />
            </div>
            <Contact items={contacts} />
            <Seperator />
          </div>
        )}

        <div
          className="items-center grid grid-rows-1 md:grid-cols-2 pb-[3ch]"
          style={{
            gap: '3ch'
          }}
        >
          <BuildJSON />
          {/* Compare by src, not identity: works data crosses the
              getStaticProps JSON boundary, so the StaticImageData object is
              a fresh copy on the client. */}
          {thumbnail.src === defaultThumbnail.src ? (
            <CommentedHeader content="No Preview Image Available" scale={120} />
          ) : (
            <Image
              src={thumbnail}
              alt={title}
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}
