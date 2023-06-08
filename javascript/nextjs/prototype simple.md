```js
import {
  Button,
  Checkbox,
  Modal,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { atom, useAtom } from "jotai";

import { fun_user_role_edit } from "../fun/fun_user_role_edit";
import { user_role_get } from "../../user/fun/user_role_get";
import { val_user_role_list } from "../val/user_role_list";
// import { val_user_role_modal_open } from "../val/user_role_modal_open";

const val_user_role_modal_open = atom(false);
const val_data_edit = atom({});
const gunakanApa = () =>
  (() => {
    const [openModalUserEdit, setOpenModalUserEdit] = useAtom(
      val_user_role_modal_open
    );
    return {
      openModalUserEdit,
      setOpenModalUserEdit,
    };
  })();

let gunakanDataEdit = {
  value: {} as any,
  set: (val: any) => {},
  panggil() {
    const ini = (() => useAtom(val_data_edit))();
    this.value = ini[0];
    this.set = ini[1] as any;
  },
};

function ViewModalUserRoleEdit() {
  //   const [openModal, setOpenModal] =  useAtom(val_user_role_modal_open);
  const { openModalUserEdit, setOpenModalUserEdit } = gunakanApa();
  const [userRoleList, setUserRoleList] = useAtom(val_user_role_list);
  gunakanDataEdit.panggil();

  async function onUpdate() {
    fun_user_role_edit({ body: gunakanDataEdit.value }).then(() => {
      user_role_get({ setUserRoleList });
      setOpenModalUserEdit(false);
    });
  }

  return (
    <>
      <Modal
        opened={openModalUserEdit}
        onClose={() => setOpenModalUserEdit(false)}
      >
        <Stack spacing={"lg"}>
          <Title>Edit</Title>
          {/* {JSON.stringify(gunakanDataEdit.value)} */}
          <Checkbox
            color="teal"
            label="Is Active"
            checked={gunakanDataEdit.value.isActive}
            onChange={(val) => {
              gunakanDataEdit.set({
                ...gunakanDataEdit.value,
                isActive: val.currentTarget.checked,
              });
            }}
          />
          <TextInput
            label="Name"
            placeholder="name"
            value={gunakanDataEdit.value.name}
            onChange={(val) =>
              gunakanDataEdit.set({
                ...gunakanDataEdit.value,
                name: val.currentTarget.value,
              })
            }
          />
          <Button bg={"teal"} onClick={onUpdate}>
            Update
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export const userRoleEdit = {
  view: ViewModalUserRoleEdit,
  use: gunakanApa,
  gunakanDataEdit,
};
```
