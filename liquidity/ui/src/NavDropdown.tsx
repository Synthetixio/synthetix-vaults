import {
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import BlogIcon from './assets/blog.svg';
import DiscordNavIcon from './assets/discord.svg';
import DocsIcon from './assets/docs.svg';
import ExchangeIcon from './assets/exchange.svg';
import GovernanceIcon from './assets/governance.svg';
import LeverageIcon from './assets/leverage.svg';
import MenuDotsIcon from './assets/menu-dots.svg';
import StakeIcon from './assets/stake.svg';
import StatsIcon from './assets/stats.svg';
import VaultsIcon from './assets/vaults.svg';
import XNavIcon from './assets/x.svg';

type MenuItemData = {
  icon: string;
  title: string;
  href: string;
  description?: string;
  active?: boolean;
};

const NavMenuItem = ({ icon, title, description, href, active = false }: MenuItemData) => {
  return (
    <MenuItem
      as="a"
      href={href}
      borderRadius="md"
      bg="transparent !important"
      _hover={{ bg: 'transparent' }}
      _active={{ bg: 'transparent' }}
      p={0}
      sx={{
        '&:hover [data-desc="description"]': {
          color: 'white',
        },
        '&:hover [data-desc="icon"]': {
          bg: active ? 'auto' : 'whiteAlpha.300',
        },
        '& [data-desc="description"], & [data-desc="link-icon"]': {
          transition: 'color 300ms ease',
        },
      }}
    >
      <Flex gap={4} align="center" w={{ base: '100%', md: '320px' }}>
        <IconButton
          aria-label={title}
          variant={active ? 'solid' : 'outline'}
          borderColor="transparent"
          _hover={active ? {} : { bg: 'whiteAlpha.200' }}
          icon={<Image src={icon} boxSize={5} color="cyan.400" alt={title} />}
          bg={active ? {} : 'whiteAlpha.200'}
          data-desc="icon"
        />
        <Flex direction="column" align="start" gap={0}>
          <Text fontWeight="medium" color="white">
            {title}
          </Text>
          <Text fontSize="xs" color="gray.500" data-desc="description">
            {description}
          </Text>
        </Flex>
      </Flex>
    </MenuItem>
  );
};

const NavLinkItem = ({ icon, title, href }: MenuItemData) => {
  return (
    <GridItem key={title}>
      <MenuItem
        as="a"
        href={href}
        borderRadius="md"
        p={0}
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        sx={{
          '&:hover [data-desc="link-text"]': {
            color: 'white',
          },
          '&:hover [data-desc="link-icon"]': {
            filter: 'brightness(2)',
          },
          '& [data-desc="link-text"]': {
            transition: 'color 300ms ease',
          },
          '& [data-desc="link-icon"]': {
            transition: 'filter 300ms ease',
          },
        }}
      >
        <Flex gap={3} p={0} align="center">
          <Image src={icon} boxSize={4} color="gray.500" data-desc="link-icon" alt={title} />
          <Text fontSize="sm" color="gray.500" data-desc="link-text">
            {title}
          </Text>
        </Flex>
      </MenuItem>
    </GridItem>
  );
};

export const NavDropdown = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Image src={MenuDotsIcon} boxSize={5} alt="Menu Dots" />}
        variant="outline"
        borderColor="whiteAlpha.200"
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'transparent' }}
      />
      <MenuList
        mt={0}
        ml={{ base: 0, md: '-126px' }}
        borderColor="whiteAlpha.200"
        borderWidth={1}
        borderStyle="solid"
        w={{ base: 'calc(100vw - 32px)', md: 'auto' }}
      >
        <Flex direction="column" align="stretch" p="16px" gap={4}>
          <NavMenuItem
            icon={StakeIcon}
            title="Stake"
            description="Simple staking in the 420 Pool"
            active={false}
            href="https://420.synthetix.io"
          />
          <NavMenuItem
            icon={ExchangeIcon}
            title="Exchange"
            description="Trade perpetual futures"
            active={false}
            href="https://exchange.synthetix.io/market/"
          />
          <NavMenuItem
            icon={VaultsIcon}
            title="Vaults"
            description="Yield products powering Synthetix"
            active={true}
            href="https://vaults.synthetix.io"
          />
          <NavMenuItem
            icon={LeverageIcon}
            title="Leverage"
            description="The easiest way to trade with leverage"
            active={false}
            href="https://leverage.synthetix.io"
          />
        </Flex>

        <Divider mx="16px" w="calc(100% - 32px)" />

        <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4}>
          <NavLinkItem icon={DocsIcon} title="Docs" href="https://docs.synthetix.io" />
          <NavLinkItem icon={BlogIcon} title="Blog" href="https://blog.synthetix.io" />
          <NavLinkItem
            icon={GovernanceIcon}
            title="Governance"
            href="https://governance.synthetix.io"
          />
          <NavLinkItem icon={StatsIcon} title="Stats" href="https://stats.synthetix.io" />
          <NavLinkItem
            icon={DiscordNavIcon}
            title="Discord"
            href="https://discord.com/invite/Synthetix"
          />
          <NavLinkItem icon={XNavIcon} title="X.com" href="https://x.com/synthetix_io" />
        </Grid>
      </MenuList>
    </Menu>
  );
};
