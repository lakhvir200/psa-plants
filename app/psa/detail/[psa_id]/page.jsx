import EquipmentDetail from "../../../components/DetailEquipmentForm";

export default function DetailPage({ params }) {
  const { psa_id } = params;
  console.log(params)

  return (
    <div>
      <EquipmentDetail psa_id={psa_id} />
    </div>
  );
}
