// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcadePoapBadge (ERC-721 Gasless Attendance & Gaming Badge for Avalanche)
 * @author Arcade Studio Engineering Team
 * @notice Contrato optimizado para minteo de Badges/PoAPs patrocinados (gasless)
 *         en Avalanche Fuji C-Chain o Subnets dedicadas.
 * 
 * CARACTERÍSTICAS:
 * 1. Gasless Minting: Solo los relayers autorizados (o el Paymaster ERC-4337) pueden mintear
 *    en nombre del usuario sin que este deba poseer AVAX ni pagar comisiones.
 * 2. Metadatos dinámicos on-chain o IPFS (Nombre del evento, Score, Timestamp, Token ID).
 * 3. Soulbound opcional: Garantiza que la insignia certifique asistencia genuina y no sea transferible.
 * 4. Soporte para minteo en lote (batch mint) ideal para acreditación masiva en eventos.
 */

interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}

contract ArcadePoapBadge {
    // --- Metadatos del Token ERC-721 ---
    string public name = "Arcade Studio Event PoAP";
    string public symbol = "ARCADIA";
    
    // --- Propietario y Relayes Autorizados ---
    address public owner;
    mapping(address => bool) public authorizedRelayers;
    
    // Si es true, el token no se puede transferir (Soulbound Badge)
    bool public isSoulbound = true;

    // --- Estructura del Badge ---
    struct BadgeMetadata {
        string eventId;
        string eventName;
        uint256 score;
        uint256 timestamp;
        string tokenURI;
    }

    uint256 private _nextTokenId = 1;

    // Mapeos ERC-721 estándar
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => BadgeMetadata) private _badgeDetails;

    // Eventos estándar ERC-721 y específicos de Arcade Studio
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    event PoapMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        string eventId,
        string eventName,
        uint256 score,
        uint256 timestamp,
        string tokenURI
    );
    event RelayerStatusUpdated(address indexed relayer, bool authorized);
    event SoulboundToggled(bool isSoulbound);

    modifier onlyOwner() {
        require(msg.sender == owner, "ArcadePoap: Only owner");
        _;
    }

    modifier onlyRelayerOrOwner() {
        require(
            msg.sender == owner || authorizedRelayers[msg.sender],
            "ArcadePoap: Caller is not authorized relayer"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedRelayers[msg.sender] = true;
    }

    // --- Administración de Relayes Patrocinadores ---
    function setAuthorizedRelayer(address relayer, bool authorized) external onlyOwner {
        require(relayer != address(0), "Invalid relayer");
        authorizedRelayers[relayer] = authorized;
        emit RelayerStatusUpdated(relayer, authorized);
    }

    function setSoulbound(bool _isSoulbound) external onlyOwner {
        isSoulbound = _isSoulbound;
        emit SoulboundToggled(_isSoulbound);
    }

    // --- FUNCIÓN CLAVE: Minting Gasless de PoAP / Badge ---
    /**
     * @notice Mintea un PoAP para el usuario final sin costo de gas para él.
     * @param recipient Dirección de la Embedded Wallet del jugador/asistente
     * @param eventId Identificador único del evento (ej: 'evt-luma-fg52mshy')
     * @param eventName Nombre legible del evento (ej: 'Dev3pack Hackathon')
     * @param score Puntaje obtenido en el arcade (0 si es solo check-in de asistencia)
     * @param metadataURI URI con metadatos JSON o imagen SVG del badge
     * @return tokenId El identificador numérico único del Badge minteado
     */
    function mintGaslessPoap(
        address recipient,
        string calldata eventId,
        string calldata eventName,
        uint256 score,
        string calldata metadataURI
    ) external onlyRelayerOrOwner returns (uint256) {
        require(recipient != address(0), "Cannot mint to zero address");

        uint256 tokenId = _nextTokenId++;
        
        _owners[tokenId] = recipient;
        _balances[recipient] += 1;

        _badgeDetails[tokenId] = BadgeMetadata({
            eventId: eventId,
            eventName: eventName,
            score: score,
            timestamp: block.timestamp,
            tokenURI: metadataURI
        });

        emit Transfer(address(0), recipient, tokenId);
        emit PoapMinted(
            recipient,
            tokenId,
            eventId,
            eventName,
            score,
            block.timestamp,
            metadataURI
        );

        return tokenId;
    }

    /**
     * @notice Minteo en lote patrocinado para registrar múltiples asistentes de una sola vez
     */
    function batchMintGaslessPoaps(
        address[] calldata recipients,
        string calldata eventId,
        string calldata eventName,
        uint256[] calldata scores,
        string[] calldata metadataURIs
    ) external onlyRelayerOrOwner returns (uint256[] memory) {
        require(recipients.length == scores.length && scores.length == metadataURIs.length, "Arrays length mismatch");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient in batch");
            uint256 tokenId = _nextTokenId++;

            _owners[tokenId] = recipients[i];
            _balances[recipients[i]] += 1;

            _badgeDetails[tokenId] = BadgeMetadata({
                eventId: eventId,
                eventName: eventName,
                score: scores[i],
                timestamp: block.timestamp,
                tokenURI: metadataURIs[i]
            });

            tokenIds[i] = tokenId;

            emit Transfer(address(0), recipients[i], tokenId);
            emit PoapMinted(
                recipients[i],
                tokenId,
                eventId,
                eventName,
                scores[i],
                block.timestamp,
                metadataURIs[i]
            );
        }

        return tokenIds;
    }

    // --- Consultas del Badge ---
    function getBadgeDetails(uint256 tokenId) external view returns (BadgeMetadata memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _badgeDetails[tokenId];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _badgeDetails[tokenId].tokenURI;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // --- Métodos ERC-721 Esenciales ---
    function balanceOf(address ownerAddress) external view returns (uint256) {
        require(ownerAddress != address(0), "Address zero is not valid owner");
        return _balances[ownerAddress];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    // Bloqueo de transferencias si isSoulbound está activo (Soulbound Token)
    function transferFrom(address from, address to, uint256 tokenId) external {
        if (isSoulbound) {
            revert("ArcadePoap: Badges are Soulbound and non-transferable");
        }
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external {
        if (isSoulbound) {
            revert("ArcadePoap: Badges are Soulbound and non-transferable");
        }
        _transfer(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, data);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        if (isSoulbound) {
            revert("ArcadePoap: Badges are Soulbound and non-transferable");
        }
        _transfer(from, to, tokenId);
        _checkOnERC721Received(from, to, tokenId, "");
    }

    function approve(address to, uint256 tokenId) external {
        if (isSoulbound) {
            revert("ArcadePoap: Approvals disabled for Soulbound badges");
        }
        address tokenOwner = _owners[tokenId];
        require(msg.sender == tokenOwner || _operatorApprovals[tokenOwner][msg.sender], "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        if (isSoulbound) {
            revert("ArcadePoap: Operator approval disabled for Soulbound badges");
        }
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address ownerAddress, address operator) external view returns (bool) {
        return _operatorApprovals[ownerAddress][operator];
    }

    // --- Helpers Internos ---
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(_owners[tokenId] == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to zero address");

        delete _tokenApprovals[tokenId];
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                if (retval != IERC721Receiver.onERC721Received.selector) {
                    revert("ERC721Receiver rejected token");
                }
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721Receiver not implemented");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }
}
