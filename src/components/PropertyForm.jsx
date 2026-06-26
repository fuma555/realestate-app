import { useState } from 'react'

const emptyValues = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集で共用するフォーム
export function PropertyForm({ initialValues = emptyValues, onSubmit, onCancel, submitting }) {
  const [values, setValues] = useState(initialValues)

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name: values.name,
      rent: Number(values.rent),
      area: values.area,
      layout: values.layout,
    })
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label htmlFor="name">物件名</label>
      <input
        id="name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="rent">家賃（円）</label>
      <input
        id="rent"
        name="rent"
        type="number"
        min="0"
        value={values.rent}
        onChange={handleChange}
        required
      />

      <label htmlFor="area">エリア名</label>
      <input
        id="area"
        name="area"
        type="text"
        value={values.area}
        onChange={handleChange}
        required
      />

      <label htmlFor="layout">間取り</label>
      <input
        id="layout"
        name="layout"
        type="text"
        placeholder="例：1LDK"
        value={values.layout}
        onChange={handleChange}
        required
      />

      <div className="property-form-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}
