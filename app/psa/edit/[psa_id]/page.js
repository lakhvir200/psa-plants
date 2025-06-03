// app/psa/edit/[psa_id]/page.js


export default function EditPage({ params }) {
  const { psa_id } = params;
  console.log(params)

  return (
    <div>
      <EditEquipmentForm psa_id={psa_id} />
    </div>
  );
}
