import { useEffect, useState } from "react";
import { useDiagram, useEnums } from "../../hooks";
import { toDBML } from "../../utils/exportAs/dbml";
import CodeEditor from "../CodeEditor";
import { fromDBML } from "../../utils/importFrom/dbml";
import { Button, Toast, Tooltip } from "@douyinfe/semi-ui";
import { IconSaveStroked } from "@douyinfe/semi-icons";
import { useTranslation } from "react-i18next";

export default function DBMLEditor() {
  const { t } = useTranslation();
  const diagram = useDiagram();
  const {
    tables: currentTables,
    relationships,
    setTables,
    setRelationships,
  } = diagram;
  const { enums, setEnums } = useEnums();
  const [value, setValue] = useState(() => toDBML({ ...diagram, enums }));

  useEffect(() => {
    setValue(toDBML({ tables: currentTables, enums, relationships }));
  }, [currentTables, enums, relationships]);

  const handleApply = () => {
    try {
      const result = fromDBML(value, diagram);
      setTables(result.tables);
      setRelationships(result.relationships);
      setEnums(result.enums);
      Toast.success(t("saved"));
    } catch (error) {
      console.error(error);
      const message = `${error.diags[0].name} [Ln ${error.diags[0].location.start.line}, Col ${error.diags[0].location.start.column}]: ${error.diags[0].message}`;
      Toast.error(message);
    }
  };

  return (
    <CodeEditor
      showCopyButton
      value={value}
      language="dbml"
      onChange={setValue}
      height="100%"
      options={{
        minimap: { enabled: false },
      }}
      extraControls={
        <Tooltip content={t("save")} position="left">
          <Button
            icon={<IconSaveStroked />}
            onClick={handleApply}
          />
        </Tooltip>
      }
    />
  );
}
