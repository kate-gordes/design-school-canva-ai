import { Columns, Column } from '@canva/easel';
import CategoryDropdown from '@/pages/Home/components/Dropdowns/CategoryDropdown';
import DateModifiedDropdown from '@/pages/Home/components/Dropdowns/DateModifiedDropdown';
import TypeDropdown from '@/pages/Home/components/Dropdowns/TypeDropdown';

const PillFilterSection = () => {
  return (
    <Columns spacing="2u">
      <Column width="content">
        <CategoryDropdown />
      </Column>
      <Column width="content">
        <DateModifiedDropdown />
      </Column>
      <Column width="content">
        <TypeDropdown />
      </Column>
    </Columns>
  );
};

export default PillFilterSection;
