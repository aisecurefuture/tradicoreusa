import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import ProductCard from '../../components/ProductCard/ProductCard'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import SortBar from '../../components/SortBar/SortBar'
import Spinner from '../../components/Spinner/Spinner'
import { mouldingCategories, getProductsByCategory } from '../../data/mockData'
import { deslugify } from '../../utils/slugify'

const PAGE_SIZE = 12

export default function Category() {
  const { categorySlug } = useParams()
  const [sort, setSort]       = useState('')
  const [filters, setFilters] = useState({})
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)

  const categoryMeta = mouldingCategories.find(c => c.slug === categorySlug)
  const categoryLabel = categoryMeta?.label ?? deslugify(categorySlug)

  useEffect(() => {
    document.title = `${categoryLabel} | TradiCore Lumber and Products`
    setPage(1)
    // Simulate async load
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [categorySlug, categoryLabel])

  useEffect(() => { setPage(1) }, [filters, sort])

  const allProducts = useMemo(() => getProductsByCategory(categorySlug), [categorySlug])

  const filtered = useMemo(() => {
    let out = [...allProducts]
    if (filters.material?.length) out = out.filter(p => filters.material.includes(p.material))
    if (filters.finish?.length)   out = out.filter(p => filters.finish.includes(p.finish))
    if (sort === 'price_asc')  out.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') out.sort((a, b) => b.price - a.price)
    if (sort === 'name_asc')   out.sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [allProducts, filters, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const activeFilterCount = (filters.material?.length || 0) + (filters.finish?.length || 0)

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary text-white py-10">
        <div className="container-site">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Moulding & Trim', href: '/collections/moulding-trim' },
            { label: categoryLabel },
          ]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 text-white">{categoryLabel}</h1>
          {categoryMeta?.description && (
            <p className="text-white/70 mt-2 max-w-xl">{categoryMeta.description}</p>
          )}
        </div>
      </div>

      <div className="container-site py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(o => !o)}
            className="flex items-center gap-2 border border-border rounded px-4 py-2 text-sm font-medium text-primary hover:border-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile conditional */}
          <aside className={`w-56 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters({})}
            />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <SortBar
              sort={sort}
              onSort={setSort}
              total={filtered.length}
              showing={paginated.length}
            />

            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted mb-4">No products match your filters.</p>
                <button onClick={() => setFilters({})} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 border border-border rounded text-sm hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-9 h-9 rounded text-sm font-medium transition-colors ${n === page ? 'bg-primary text-white' : 'border border-border hover:border-accent'}`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 border border-border rounded text-sm hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Trade account CTA */}
        <div className="mt-12 rounded-xl bg-primary/5 border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-semibold text-primary text-lg">Buying in volume?</h4>
            <p className="text-muted text-sm mt-1">Apply for a trade account and get wholesale pricing.</p>
          </div>
          <Link to="/trade" className="btn-primary flex-shrink-0">Apply for Trade Account</Link>
        </div>
      </div>
    </Layout>
  )
}
