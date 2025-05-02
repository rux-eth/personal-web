import { categories } from '@src/components/category'
import Link from '@src/components/link'
import NotFound from '@src/pages/404'
import transition from '@src/styles/utils'
import { assertWorkInfo, WorkInfo } from '@src/types'
import { dynamicFont } from '@src/utils/hooks/getCurrentBreakpoint'
import { List, Map as IMap, Set } from 'immutable'
import Image from 'next/image'
import worksJSON from 'public/works.json'
import { FC, useState } from 'react'
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
import ComingSoonPage from './comingSoon'

export class Works {
  works: List<WorkInfo>

  constructor(_works?: any[]) {
    this.works = List(worksJSON.map(assertWorkInfo))
    /*     this.works = _works
      ? List(_works.map(assertWorkInfo))
      : List(worksJSON.map(assertWorkInfo)); */
  }

  compileTags(item: WorkInfo): Set<string> {
    const { status, role, languages, stack, website, article, trello } = item
    let tags = [status, role, ...languages.toArray(), ...stack.toArray()]
    if (website) {
      tags.push('website')
    }
    if (article) {
      tags.push('article')
    }
    if (trello) {
      tags.push('trello')
    }
    return Set(tags)
  }

  getAllPreviews(filters?: Set<string>): JSX.Element[] {
    const fs = dynamicFont(100)
    let temp = this.works.toArray()
    let filt = filters?.toArray()
    if (filt && filt.length > 0) {
      temp = temp.filter(elem => {
        let res = (filt as string[]).some((tag, _) =>
          this.compileTags(elem).has(tag)
        )
        return res
      })
    }
    return temp.map(elem => {
      const {
        id,
        title,
        description,
        thumbnail,
        status,
        role,
        languages,
        stack,
        website,
        article,
        trello
      } = elem
      let tags = [status, role, ...languages.toArray(), ...stack.toArray()]
      if (website) {
        tags.push('website')
      }
      if (article) {
        tags.push('article')
      }
      if (trello) {
        tags.push('trello')
      }
      return (
        <div
          className="w-full text-center opacity-[75%] hover:opacity-[100%] duration-300"
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
                width={'1980px'}
                height={'1080px'}
                className="grid-item-thumbnail rounded-lg"
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
                {tags.map(elem => {
                  if (!(elem in categories))
                    throw new Error(`Invalid tag ${elem}`)
                  return categories[elem]
                })}
              </div>
            </div>
          </Link>
        </div>
      )
    })
  }

  getTags(): IMap<
    'Status' | 'Stack' | 'Language' | 'Other',
    IMap<string, number>
  > {
    let temp: IMap<
      'Status' | 'Stack' | 'Language' | 'Other',
      IMap<string, number>
    > = IMap()
    this.works.forEach(elem => {
      temp = temp.updateIn(
        ['Status', elem.status],
        0,
        val => (val as number) + 1
      )
      elem.stack.forEach((s: string) => {
        if (s in categories) {
          temp = temp.updateIn(['Stack', s], 0, val => (val as number) + 1)
        }
      })
      elem.languages.forEach(l => {
        if (l in categories) {
          temp = temp.updateIn(['Language', l], 0, val => (val as number) + 1)
        }
      })
      temp = temp.updateIn(['Other', elem.role], 0, val => (val as number) + 1)
      if (elem.website) {
        temp = temp.updateIn(
          ['Other', 'website'],
          0,
          val => (val as number) + 1
        )
      }
      if (elem.article) {
        temp = temp.updateIn(
          ['Other', 'article'],
          0,
          val => (val as number) + 1
        )
      }
      if (elem.trello) {
        temp = temp.updateIn(['Other', 'trello'], 0, val => (val as number) + 1)
      }
    })

    return temp
  }
  getWork(id: string): WorkInfo | undefined {
    return this.works.find(val => val.id === id)
  }
  worksPage(): JSX.Element {
    // constants
    const [isList, setIsList] = useState(false)
    const fs = dynamicFont(100)
    const [filters, setFilters] = useState(Set([]) as Set<string>)
    const handleFilterChange = (filter: string) => {
      filters.has(filter)
        ? setFilters(filters.remove(filter))
        : setFilters(filters.add(filter))
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
                    transform: isList ? 'rotate(0.5)turn' : 'rotate(0.5)turn'
                  }}
                >
                  <FaArrowDown />
                </div>
              </div>
              <div
                className="absolute p-[0.3ch] left-[50%] w-[20ch] text-white shadow rounded-[0.5ch] z-10 bg-black"
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
                  {this.getTags()
                    .map(
                      (subTags, mainTag): JSX.Element => (
                        <>
                          <div className="flex items-center justify-between py-[0.2ch]">
                            <div className="flex items-center">
                              <p className="text-[1.5ch] leading-normal font-bold">{`${mainTag}`}</p>
                            </div>
                            <p className="text-[1.5ch] text-blue-300">
                              {(() => {
                                return `${List(subTags.values()).reduce(
                                  (p: number, c: number) => p + c
                                )}`
                              })()}
                            </p>
                          </div>
                          <div className="space-y-[0.3ch]">
                            {subTags
                              .map(
                                (nums, subTag): JSX.Element => (
                                  <button
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
                                        color: filters.has(subTag)
                                          ? 'black'
                                          : ''
                                      }}
                                    >
                                      {`${nums}`}
                                    </p>
                                  </button>
                                )
                              )
                              .valueSeq()}
                          </div>
                        </>
                      )
                    )
                    .valueSeq()}
                </div>
                <div className="bg-black">
                  <div className="grid grid-cols-2 gap-2 p-2 justify-items-stretch">
                    <button
                      className="bg-red-500 rounded-[0.5ch]"
                      onClick={() => setFilters(Set([]))}
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
            {filters.map(filter => (
              <button
                className="-my-[0.31ch]"
                onClick={() => handleFilterChange(filter)}
              >
                {categories[filter]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 p-6 my-[3ch]">
            {this.getAllPreviews(filters)}
          </div>
        </div>
      </Layout>
    )
  }
  workPage(id: string): JSX.Element {
    const data = this.getWork(id)
    const fs = dynamicFont(100)
    if (!data) return <NotFound />
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
    } = data
    let links: { [key: string]: JSX.Element } = {}
    let contacts: ContactItem[] = []
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
          sx={{
            color: '#DDDDDD',
            textDecoration: 'none',
            transition,
            transitionDuration: '500ms',
            ':hover': {
              color: '#ffffff',
              cursor: 'pointer'
            }
          }}
        >
          {children}
        </Link>
      )
    }

    if (repo) {
      links['Repository'] = (
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
      links['Website'] = (
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
      links['Article'] = (
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
      links['Progress'] = (
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
      items: Array<JSX.Element> | JSX.Element
    }> = ({ cat, items }) => {
      return Array.isArray(items) ? (
        <p className="pl-[3ch]">
          {`"${cat}": [`}
          <div className="space-y-[1px] scale-95">
            {items.map((elem, index, arr) =>
              index < arr.length - 1 ? (
                <div>
                  <span className="pl-[2ch]">{elem},</span>
                </div>
              ) : (
                <div>
                  <span className="pl-[2ch]">{elem}</span>
                </div>
              )
            )}
          </div>
          {'],'}
        </p>
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
          {stack.size > 0 && (
            <ItemsJSON
              cat="Stack"
              items={Array.from(stack).map(elem => categories[elem])}
            />
          )}
          {languages.size > 0 && (
            <ItemsJSON
              cat="Languages"
              items={Array.from(languages).map(elem => categories[elem])}
            />
          )}
          {status && <ItemsJSON cat="Status" items={categories[status]} />}
          <ItemsJSON cat="Role" items={categories[role]} />
          {Object.keys(links).length > 0 && (
            <div className="pl-[6ch]">
              {`"Links": {`}
              {Object.entries(links).map(([key, val]) => (
                <ItemsJSON cat={key} items={val} />
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
          {/* {this.isClient && (
            <>
              <CommentedHeader content="You're an Admin for this Work" />
              <Link className="white-comp" href={`/works/${id}/edit`}>
                <span>Edit this Work</span>
              </Link>
            </>
          )} */}
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
            {thumbnail === '/thumbnails/default.png' ? (
              <CommentedHeader
                content="No Preview Image Available"
                scale={120}
              />
            ) : (
              <img src={thumbnail} />
            )}
          </div>
        </div>
      </Layout>
    )
  }
}
