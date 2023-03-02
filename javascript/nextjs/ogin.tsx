import {
  Anchor,
  BackgroundImage,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  useDisclosure,
  useFocusTrap,
  useMediaQuery,
  useShallowEffect,
  useViewportSize,
} from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons";
import { RecaptchaVerifier, signInWithPhoneNumber, User } from "firebase/auth";
import _ from "lodash";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { authentication } from "../public/firebase-config";

const V2Login = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [term, setterm] = useDisclosure(false);
  const [toLogin, setTologin] = useState<boolean>(false);

  if (toLogin)
    return (
      <>
        <LoginActivity />
      </>
    );

  return (
    <>
      <BackgroundImage h={"102vh"} src="/v2/v2_bg.png" m={0} p={0}>
        <Grid>
          <Grid.Col
            md={"content"}
            sm={"content"}
            xs={"auto"}
            p={0}
            m={0}
            pos={"relative"}
          >
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "purple" }}
              w={"100%"}
              h={"102vh"}
              pos={"absolute"}
              style={{ zIndex: 0 }}
            />
            <Box p={"xs"} sx={{ zIndex: 10 }} pos={"relative"}>
              <Stack
                h={"102vh"}
                miw={360}
                align={"center"}
                justify={"center"}
                p={"0"}
                m={0}
              >
                <Box>
                  <Text size={42} c={"gray.1"}>
                    WELCOME
                  </Text>
                  <Text size={42} c={"gray.1"}>
                    to
                  </Text>
                  <Text size={42} c={"gray.1"}>
                    EAGLE EYE
                  </Text>
                  <Text size={42} c={"gray.1"}>
                    PROJECT
                  </Text>
                  <Text w={280} c={"gray.4"}>
                    Halo dan selamat datang kembali! Kami senang Anda kembali
                    lagi untuk menggunakan layanan kami. Silakan login untuk
                    melanjutkan pengalaman penggunaan yang luar biasa ini.
                    Terima kasih telah memilih kami!
                  </Text>
                  <Space h={70} />
                  {/* {term.toString()} */}
                  {isMobile && (
                    <Flex py={"lg"}>
                      <Checkbox onChange={(val) => setterm.toggle()} />
                      <Anchor px={"xs"} href="" target={"_blank"}>
                        Term & Service
                      </Anchor>
                    </Flex>
                  )}
                  <Button
                    disabled={!term}
                    p={"xs"}
                    gradient={{ from: "cyan", to: "indigo.9", deg: 180 }}
                    fullWidth
                    variant="gradient"
                    radius={100}
                    onClick={() => setTologin(true)}
                  >
                    LOGIN
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid.Col>
          <Grid.Col md={"auto"} sm={"auto"} p={0} m={0}>
            {!isMobile && (
              <Stack h={"102vh"} justify={"end"}>
                <Box bg={"black"} opacity={0.6} p={"xs"}>
                  <Flex align={"center"}>
                    <Checkbox onChange={(val) => setterm.toggle()} />
                    <Text c={"gray.3"} p={"xs"} size={12}>
                      Terima kasih telah menerima. dengan menggunakan service
                      ini, Anda setuju untuk mematuhi ketentuan layanan dan
                      kebijakan privasi kami, termasuk penerimaan cookies yang
                      digunakan untuk meningkatkan pengalaman pengguna Anda di
                      aplikasi ini
                    </Text>
                  </Flex>
                </Box>
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </BackgroundImage>
    </>
  );
};

const LoginActivity = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [term, setterm] = useDisclosure(false);
  const idSigninButton = useId();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [isConfirm, setIsconfirm] = useState<boolean>(false);

  const generateCapta = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      idSigninButton,
      {
        size: "invisible",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
          console.log("yes berhasil");
          console.log(response);
        },
      },
      authentication
    );
  };

  const loginPhone = () => {
    if (!phoneNumber) return toast.error("isi nomer terlebih dahulu");
    if (_.isEmpty(phoneNumber)) return toast.error("nomer tidak boleh kosong");
    if (phoneNumber?.length! < 10)
      return toast.error(
        "masukkan format nomer yang benar, contoh: 81234567890"
      );
    generateCapta();
    const appVeryfier = window.recaptchaVerifier;
    signInWithPhoneNumber(authentication, `+62${phoneNumber}`, appVeryfier)
      .then((result) => {
        console.log("ok sms sent");
        window.confirmationResult = result;
        setIsconfirm(true);
      })
      .catch((err) => {
        console.log("sms not sent", err);
      });
  };

  // return (
  //   <>
  //     <LoginConfirm />
  //   </>
  // );
  if (isConfirm)
    return (
      <>
        <LoginConfirm />
      </>
    );

  return (
    <>
      <div id={idSigninButton}></div>
      <BackgroundImage h={"102vh"} src="/v2/v2_bg.png" m={0} p={0}>
        <Grid>
          <Grid.Col
            md={"content"}
            sm={"content"}
            xs={"auto"}
            p={0}
            m={0}
            pos={"relative"}
          >
            <Button
              variant="gradient"
              gradient={{ from: "purple", to: "blue.7" }}
              w={"100%"}
              h={"102vh"}
              pos={"absolute"}
              sx={{ zIndex: 0 }}
            />
            <ScrollArea
              h={"102vh"}
              miw={360}
              py={"lg"}
              // align={"center"}
              // justify={"center"}
              p={"0"}
              m={0}
              pos={"relative"}
              // spacing={"lg"}
            >
              <Stack align={"center"} justify={"stretch"}>
                <Image
                  width={200}
                  src={"/v2/logo_eagle.png"}
                  alt={"logo"}
                  mb={70}
                />
                <Box mb={"lg"}>
                  <Text size={42} color={"white"}>
                    WELCOME
                  </Text>
                  <Text color={"white"}>login untuk melanjutkan</Text>
                </Box>
                <TextInput
                  value={phoneNumber}
                  icon={<Text>+62</Text>}
                  opacity={0.5}
                  color={"white"}
                  onChange={(val) => setPhoneNumber(val.currentTarget.value)}
                  mb={"lg"}
                />

                {isMobile && (
                  <Flex py={"lg"}>
                    <Checkbox onChange={(val) => setterm.toggle()} />
                    <Anchor px={"xs"} href="" target={"_blank"}>
                      OTP Service
                    </Anchor>
                  </Flex>
                )}
                <Button
                  disabled={!term}
                  w={200}
                  p={"xs"}
                  gradient={{ from: "cyan", to: "indigo.9", deg: 180 }}
                  variant="gradient"
                  radius={100}
                  onClick={loginPhone}
                >
                  KIRIM
                </Button>
                <Flex w={200} py={"md"}>
                  <Box w={50}>
                    <IconInfoCircle size={24} color={"white"} />
                  </Box>
                  <Text px={"xs"} size={12} c={"gray.2"}>
                    Penting untuk selalu menjaga keamanan nomor telepon Anda dan
                    tidak membagikannya dengan orang lain. Jika ada masalah atau
                    kesulitan saat melakukan login, pastikan untuk menghubungi
                    layanan dukungan pelanggan yang tersedia.
                  </Text>
                </Flex>
              </Stack>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col md={"auto"} sm={"auto"} p={0} m={0}>
            {!isMobile && (
              <Stack h={"102vh"} justify={"end"}>
                <Box bg={"black"} opacity={0.6} p={"xs"}>
                  <Flex align={"center"}>
                    <Checkbox onChange={(val) => setterm.toggle()} />
                    <Text c={"gray.3"} p={"xs"} size={12}>
                      Saya setuju untuk menerima OTP sebagai metode verifikasi
                      untuk melindungi akun saya
                    </Text>
                  </Flex>
                </Box>
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </BackgroundImage>
    </>
  );
};

const listPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const LoginConfirm = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const ref1 = useRef();
  const ref2: any = useRef();
  const ref3: any = useRef();
  const ref4: any = useRef();
  const [keBerapa, setKeberapa] = useState<number>(0);

  const [listBox, setListBox] = useState<{ [key: string]: string }[]>([
    {
      id: "1",
      value: "",
    },
    {
      id: "2",
      value: "",
    },
    {
      id: "3",
      value: "",
    },
    {
      id: "4",
      value: "",
    },
    {
      id: "5",
      value: "",
    },
    {
      id: "6",
      value: "",
    },
  ]);

  const confirm = () => {
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(listBox.map((v) => v.value).join(""))
      .then((result: any) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        // ...
        toast.success("success");
      })
      .catch((error: any) => {
        console.log(error);
        // User couldn't sign in (bad verification code?)
        // ...
        toast.error("code salsah , mohon periksa kembali");
      });
  };

  return (
    <>
      <BackgroundImage h={"102vh"} src="/v2/v2_bg.png" m={0} p={0}>
        <Grid>
          <Grid.Col
            md={"content"}
            sm={"content"}
            xs={"auto"}
            p={0}
            m={0}
            pos={"relative"}
          >
            <Button
              variant="gradient"
              gradient={{ from: "purple", to: "blue.7" }}
              w={"100%"}
              h={"102vh"}
              pos={"absolute"}
              sx={{ zIndex: 0 }}
              opacity={0.8}
            />
            <ScrollArea
              h={"102vh"}
              miw={360}
              py={"lg"}
              // align={"center"}
              // justify={"center"}
              p={"0"}
              m={0}
              pos={"relative"}
              // spacing={"lg"}
            >
              <Stack align={"center"} justify={"stretch"}>
                <Image
                  width={200}
                  src={"/v2/logo_eagle.png"}
                  alt={"logo"}
                  mb={20}
                />
                <Box mb={"lg"} w={300}>
                  <Text size={32} color={"white"} align={"center"}>
                    {_.upperCase("please enter your code")}
                  </Text>
                  {/* <Text color={"white"}>login untuk melanjutkan</Text> */}
                </Box>

                <Grid grow w={250}>
                  {listBox.map((v) => (
                    <Grid.Col key={v.id} span={2}>
                      <Center
                        bg={"white"}
                        opacity={v.id === (keBerapa + 1).toString() ? 0.6 : 0.3}
                        h={50}
                        sx={{ borderRadius: 8 }}
                      >
                        <Text fz={24}>{v.value}</Text>
                      </Center>
                    </Grid.Col>
                  ))}
                </Grid>
                <Box w={250}>
                  <Text size={12} color={"gray.2"} align={"center"}>
                    kami telah mengirimkan kode pada hanphone anda, pastikan
                    untuk tidak membagikannya kepada siapapun
                  </Text>
                </Box>
                <Grid grow w={250}>
                  {listPad.map((v: any) => (
                    <Grid.Col key={v} span={4} opacity={0.4}>
                      <Button
                        h={60}
                        fullWidth
                        variant="light"
                        onClick={() => {
                          let ls = [...listBox];
                          ls[keBerapa].value = v as any;
                          setListBox(ls);
                          if (keBerapa >= listBox.length - 1) {
                            setKeberapa(0);
                          } else {
                            setKeberapa((val) => (val += 1));
                          }
                        }}
                      >
                        <Text>{v}</Text>
                      </Button>
                    </Grid.Col>
                  ))}
                </Grid>
                {/* <TextInput
                  //   value={phoneNumber}
                  icon={<Text>+62</Text>}
                  opacity={0.5}
                  color={"white"}
                  //   onChange={(val) => setPhoneNumber(val.currentTarget.value)}
                  mb={"lg"}
                /> */}

                {/* {isMobile && (
                  <Flex py={"lg"}>
                    <Checkbox onChange={(val) => setterm.toggle()} />
                    <Anchor px={"xs"} href="" target={"_blank"}>
                      OTP Service
                    </Anchor>
                  </Flex>
                )} */}
                <Button
                  //   disabled={!term}
                  w={250}
                  p={"xs"}
                  gradient={{ from: "cyan", to: "indigo.9", deg: 180 }}
                  variant="gradient"
                  radius={100}
                    onClick={confirm}
                >
                  KIRIM
                </Button>
                {/* <Flex w={200} py={"md"}>
                  <Box w={50}>
                    <IconInfoCircle size={24} color={"white"} />
                  </Box>
                  <Text px={"xs"} size={12} c={"gray.2"}>
                    Penting untuk selalu menjaga keamanan nomor telepon Anda dan
                    tidak membagikannya dengan orang lain. Jika ada masalah atau
                    kesulitan saat melakukan login, pastikan untuk menghubungi
                    layanan dukungan pelanggan yang tersedia.
                  </Text>
                </Flex> */}
              </Stack>
            </ScrollArea>
          </Grid.Col>
          <Grid.Col md={"auto"} sm={"auto"} p={0} m={0}>
            {/* {!isMobile && (
              <Stack h={"102vh"} justify={"end"}>
                <Box bg={"black"} opacity={0.6} p={"xs"}>
                  <Flex align={"center"}>
                    <Checkbox onChange={(val) => setterm.toggle()} />
                    <Text c={"gray.3"} p={"xs"} size={12}>
                      Saya setuju untuk menerima OTP sebagai metode verifikasi
                      untuk melindungi akun saya
                    </Text>
                  </Flex>
                </Box>
              </Stack>
            )} */}
          </Grid.Col>
        </Grid>
      </BackgroundImage>
    </>
  );
};

export default V2Login;
