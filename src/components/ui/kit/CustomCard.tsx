import { Card, CardContent, Typography, Box } from "@mui/material";
import { memo, type FC } from "react";
import type { CustomCardProps } from "@/interfaces/ui/kit/ICustomCard";
import { cardVariantStyles } from "@/shared/design/cardVariants";

const CustomCardComponent: FC<CustomCardProps> = ({
  title,
  description,
  variant = "terciary",
  headerExtra,
  children,
  hoverable = false,
  fullWidth = false,
}) => {
  const styles = cardVariantStyles[variant];

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,
        borderRadius: 3,
        width: fullWidth ? "100%" : "auto",
        transition: "all 0.2s ease",

        ...(hoverable && styles.hoverBg && {
          "&:hover": {
            backgroundColor: styles.hoverBg,
          },
        }),
      }}
    >
      <CardContent>
        {(title || headerExtra) && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            {title && (
              <Typography fontWeight={600} fontSize="1rem">
                {title}
              </Typography>
            )}

            {headerExtra}
          </Box>
        )}

        {description && (
          <Typography
            fontSize="0.9rem"
            color="text.secondary"
            mb={children ? 2 : 0}
          >
            {description}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

export const CustomCard = memo(CustomCardComponent);
