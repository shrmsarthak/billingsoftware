import { Card, Typography, Button, Tooltip } from "@material-tailwind/react";

export function ProductInvoiceTable({
  TABLE_HEAD,
  TABLE_ROWS,
  handleDeleteRow,
}) {
  return (
    <Card
      className="max-h-96 w-full overflow-scroll"
      style={{ overflow: "auto" }}
    >
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
                      <Tooltip content="Delete">
                        <Button
                          color="white"
                          size="xs" // Adjusted button size to xs
                          onClick={() => handleDeleteRow(index)}
                          className="py-1 px-2" // Adjusted padding
                        >
                          <svg
                            class="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                        </Button>
                      </Tooltip>
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
