

export default function CMCEditPage({ params }) {
  const { psa_id } = params;
  console.log(params)

  return (
    <div>
      <EditCmcForm psa_id={psa_id} />
    </div>
  );
}
