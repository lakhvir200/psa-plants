export default function ServiceReportDetail({ params }) {
 const { id } = params;
  console.log( params)

  return (
    <div>
      <ServiceReportDetail id={id} />
    </div>
  );
}
