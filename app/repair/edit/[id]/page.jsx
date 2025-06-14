export default function ServiceEditPage({ params }) {
  const { id } = params;
  console.log(params)

  return (
    <div>
      <EditServiceForm id={id} />
    </div>
  );
}
