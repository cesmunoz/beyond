import { scan } from '../../util/DynamoIO';
import { buildScan } from '../../util/DynamoMeta';
import { CoachModel } from '../../models/CoachModel';

const getCoachs = async (): Promise<Array<CoachModel>> => {
  const scanInput = buildScan('GS1');

  const result = await scan<CoachModel>(scanInput);
  return result;
};

export default getCoachs;
