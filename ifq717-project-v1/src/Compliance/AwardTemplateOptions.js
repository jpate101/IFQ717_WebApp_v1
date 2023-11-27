import { useParams } from 'react-router-dom';

function AwardTemplateOptions() {
  const { id } = useParams();

  return (
    <div>
      <h2>Award Template Details - {id}</h2>
    </div>
  );
}

export default AwardTemplateOptions;