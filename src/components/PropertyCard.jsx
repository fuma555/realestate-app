// 物件名・家賃・エリア・間取りを表示し、編集・削除操作を行うカードコンポーネント
export function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div className="property-card">
      <h3>{property.name}</h3>
      <p className="property-rent">家賃: {property.rent.toLocaleString()}円</p>
      <p className="property-area">エリア: {property.area}</p>
      <p className="property-layout">間取り: {property.layout}</p>

      <div className="property-card-actions">
        <button onClick={() => onEdit(property)}>編集</button>
        <button className="danger" onClick={() => onDelete(property)}>
          削除
        </button>
      </div>
    </div>
  )
}
