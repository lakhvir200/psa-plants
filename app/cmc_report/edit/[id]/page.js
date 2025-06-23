export default function ServiceReportPage({ params }) {
 const { id } = params;
  console.log( params)

  return (
    <div>
      <UploadCmc id={id} />
    </div>
  );
}
