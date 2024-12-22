import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableTwo from '../components/Tables/TableTwo';

const TablesProduct = () => {
  return (
    <>
      <Breadcrumb pageName="Products Manager" />

      <div className="flex flex-col gap-10">
        <TableTwo />
      </div>
    </>
  );
};

export default TablesProduct;
