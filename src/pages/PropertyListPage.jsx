import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PropertyCard } from '../components/PropertyCard'
import { PropertyForm } from '../components/PropertyForm'
import { createProperty, deleteProperty, fetchProperties, updateProperty } from '../lib/properties'

export function PropertyListPage() {
  const { session, signOut } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // フォームの表示状態（null: 非表示、'create': 新規登録、物件オブジェクト: 編集中）
  const [formTarget, setFormTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadProperties = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch (err) {
      setError('物件の取得に失敗しました: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleFormSubmit = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      if (formTarget && formTarget !== 'create') {
        await updateProperty(formTarget.id, values)
      } else {
        await createProperty({ ...values, userId: session.user.id })
      }
      setFormTarget(null)
      await loadProperties()
    } catch (err) {
      setError('保存に失敗しました: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setError('')
    try {
      await deleteProperty(property.id)
      await loadProperties()
    } catch (err) {
      setError('削除に失敗しました: ' + err.message)
    }
  }

  const isFormOpen = formTarget !== null
  const editingValues =
    formTarget && formTarget !== 'create'
      ? {
          name: formTarget.name,
          rent: formTarget.rent,
          area: formTarget.area,
          layout: formTarget.layout,
        }
      : undefined

  return (
    <div className="property-list-page">
      <header className="property-list-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-user">{session.user.email}でログイン中</p>
        </div>
        <button onClick={signOut}>ログアウト</button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {!isFormOpen && <button onClick={() => setFormTarget('create')}>物件を新規登録</button>}

      {isFormOpen && (
        <PropertyForm
          initialValues={editingValues}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormTarget(null)}
        />
      )}

      {loading ? (
        <p className="loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p>登録されている物件はありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={(target) => setFormTarget(target)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
