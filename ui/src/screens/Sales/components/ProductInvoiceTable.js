import { Card, Typography, Button } from "@material-tailwind/react";
import { Icon } from '@material-tailwind/react';

export function ProductInvoiceTable({
  TABLE_HEAD,
  TABLE_ROWS,
  handleDeleteRow,
}) {
  return (
    <Card className="max-h-56 w-full overflow-scroll">
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={index}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-2"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 text-xs"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((values, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-50";

            return (
              <tr key={index}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal text-xs"
                  >
                    {index + 1}
                  </Typography>
                </td>
                {Object.keys(values).map((v, idx) => (
                  <td className={classes} key={idx}>
                    {values[v] === "DELETE" ? (
                      <Button
                        color="red"
                        size="xs" // Adjusted button size to xs
                        onClick={() => handleDeleteRow(index)}
                        className="py-1 px-2" // Adjusted padding
                      >
                        Delete
                      </Button>
                    ) : (
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal text-xs"
                      >
                        {values[v] == null ? "None" : values[v]}
                      </Typography>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
