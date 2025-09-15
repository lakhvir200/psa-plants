export default function TaskEditPage({ params }) {
  const { id } = params;
  console.log(params)

  return (
    <div>
      <EditTaskForm id={id} />
    </div>
  );
}
