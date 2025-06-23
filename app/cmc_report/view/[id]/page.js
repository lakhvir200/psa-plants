export default function CmcReportDetail({ params }) {
 const { id } = params;
  console.log( params)

  return (
    <div>
      <CmcReportDetail id={id} />
    </div>
  );
}
