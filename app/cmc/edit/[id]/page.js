

export default function CMCEditPage({ params }) {
  const { id } = params;
  console.log(params)

  return (
    <div>
      <EditCmcForm id={id} />
    </div>
  );
}
