import { Title, Text, Stepper, Button, Group, Image, Accordion, Card, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useEnsName } from 'wagmi'
import axios from "axios";


export default function Verify() {

    const { address, isConnected } = useAccount()
    const [active, setActive] = useState(0);
    const [gistLink, setGistLink] = useState('');
    const [verified, setVerified] = useState<boolean | undefined>(undefined);
    const [githubName, setGithubName] = useState('');
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    // call verifygist if active is 3 and gistLink is not empty, use useEffect
    useEffect(() => {
        console.log('active', active);
        console.log('gistLink', gistLink);
        if (active === 2 && gistLink) {
            verifyGist(address!, gistLink);
        }
    }, [active, gistLink]);

    async function verifyGist(address: string, gistLink: string) {
        const endpoint = 'https://api.github.com/gists';
        const gistid = gistLink.split('/').pop();
        const url = `${endpoint}/${gistid}`;
        const response = await fetch(url);
        const gist = await response.json();
        const username = gist.owner.login;
        setGithubName(username);
        console.log('username', username);
        for (const [key, value] of Object.entries<{ content: string }>(gist.files)) {
            console.log(key, value);
            if (value.content.includes(address)) {
                console.log('found address in gist');
                setVerified(true);
                return true;
            }
        }
        console.log('did not find address in gist');
        setVerified(false);
        return false;
    }

    async function handleDataUpload() {
        console.log('handleDataUpload');
        const endpoint = 'https://nft-backend-hackonchain.azurewebsites.net/add';
        const response = await axios.post(endpoint, {
            wallet: address,
            github: githubName,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response);
        nextStep();
    }

    return (
        <>
            <div style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                display: 'flex',
            }}>
                {/* <Image src={"/pc.jpeg"} width={400} /> */}
                <br />
                <Title>Connect your GitHub to your MiladyPoland NFT!</Title>
                <Text>Connecting your NFT allows you to make use of our cool metadata with the developer score </Text>
                <br />
                <Stepper active={active} onStepClick={setActive} breakpoint="sm" allowNextStepsSelect={false}>
                    <Stepper.Step label="First step" description="Connect Wallet">
                        <br />
                        <Card style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} padding={50}>
                            <Title>{!isConnected ? 'Please connect your wallet! <3' : 'Connected!'} </Title>
                            <br />
                            {!isConnected ? <ConnectButton accountStatus={'address'} /> :
                                <>
                                    <Text>{`Connected as: ${address}`}</Text>
                                    <br />
                                    <Button onClick={nextStep}>Next step</Button>
                                </>
                            }
                        </Card>
                    </Stepper.Step>
                    <Stepper.Step label="Second step" description="Publish a gist">
                        <Card style={{ textAlign: 'center' }} padding={50}>
                            <Title>Publish a gist! </Title>
                            <Text>Create a public Gist at: <a href="https://gist.github.com" target="blank">https://gist.github.com</a></Text>
                            <Text>Enter your wallet's address in the body, just as in the example.</Text>
                            <br />
                            <Accordion defaultValue="example">
                                <Accordion.Item value="example">
                                    <Accordion.Control>Example</Accordion.Control>
                                    <Accordion.Panel>                            <Image src={"https://i.imgur.com/tN4TMNH.png"} />
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                            <br />
                            <Text>Copy the link to your gist and paste it below.</Text>
                            <br />
                            <TextInput placeholder="https://gist.github.com/..." value={gistLink} onChange={(event) => setGistLink(event.currentTarget.value)} />
                            <br />
                            <Button disabled={!gistLink} onClick={nextStep}>Next step</Button>

                        </Card>
                    </Stepper.Step>
                    <Stepper.Step label="Final step" description="Verify the gist">
                        <Card style={{ textAlign: 'center' }} padding={50}>
                            <Title>{verified === undefined ? 'Verifying...' : verified === false ? 'Failed to verify' : 'Success!'}</Title>
                            <br />
                            <Text>Click the button to push your info to the backend!</Text>
                            <Button onClick={handleDataUpload}>Next step</Button>
                        </Card>
                    </Stepper.Step>
                    <Stepper.Completed>
                        Completed, click back button to get to previous step
                    </Stepper.Completed>
                </Stepper>

                {/* <Group position="center" mt="xl">
                    <Button variant="default" onClick={prevStep}>Back</Button>
                    <Button onClick={nextStep}>Next step</Button>
                </Group> */}
            </div>
        </>
    )
}
