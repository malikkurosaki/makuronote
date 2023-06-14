```ts
import { hook_loadiung } from "@/glb/hook/loading";
import { ModelHasil } from "@/model/true-caller/model_hasil";
import { Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import phone from "phone";
import toast from "react-simple-toasts";

type DataLogin = {
  status: number;
  message: string;
  domain: string;
  parsedPhoneNumber: number;
  parsedCountryCode: string;
  requestId: string;
  method: string;
  tokenTtl: number;
};

type DataNya = {
  status: number;
  message: string;
  installationId: string;
  ttl: number;
  userId: number;
  suspended: boolean;
  phones: Phone[];
};

type Phone = {
  phoneNumber: number;
  countryCode: string;
  priority: number;
};

export function ComTrueCaller() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasil, setHasil] = useState<ModelHasil | null>(null);
  const installId =
    "a1i0o--frFlbxVt-U7pLzz6yei0DRgR7bLehPb1byd6znGGl5v4HcZJ696pa_YC2";

  async function onOtpSubmit() {
    const ada = phone("+62"+phoneNumber);
    console.log(ada.phoneNumber)
    if (!ada.isValid) return toast("Nomor tidak valid");
    hook_loadiung.set(true);
    var search_data = {
      number: "62" + phoneNumber,
      countryCode: "ID",
      installationId: installId,
    };

    const data = await fetch("/api/true-caller/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(search_data),
    }).then((res) => res.json());

    setHasil(data);
    hook_loadiung.set(false);
  }

  return (
    <>
      <Group>
        <Stack>
          <Title>Siapa Nomer Ini ?</Title>
          {/* <pre>{JSON.stringify(hasil, null, 2)}</pre> */}
          <Group align="end">
            <TextInput
              onChange={(val) => {
                if (val) {
                  setPhoneNumber(val.target.value);
                }
              }}
              icon={<Text>+62</Text>}
              w={300}
              label="phone number"
              placeholder="81xxxxxx"
            />
            <Button onClick={onOtpSubmit}>Send</Button>
          </Group>
          <Title>{hasil?.data[0].name}</Title>
          <Title order={3}>{hasil?.data[0].phones[0].carrier}</Title>
        </Stack>
      </Group>
    </>
  );
}

```
